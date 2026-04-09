import { useEffect, useState, type FormEvent, type InputHTMLAttributes } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import type { InvoiceOrderPayload } from '../lib/invoice';
import { lookupUsPostalCode, updateTradeProfile } from '../lib/auth';
import { createWholesaleOrder } from '../lib/orders';

type CheckoutFormState = {
  company: string;
  businessType: string;
  contactName: string;
  email: string;
  phone: string;
  country: string;
  state: string;
  city: string;
  address: string;
  postalCode: string;
  notes: string;
};

type CheckoutFieldKey = Exclude<keyof CheckoutFormState, 'notes' | 'company' | 'businessType'>;
type CheckoutFieldErrors = Partial<Record<CheckoutFieldKey, string>>;
type PostalLookup = {
  zipCode: string;
  city: string;
  state: string;
};

type PaymentMethod = 'bank_transfer';

const US_STATE_OPTIONS = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
  { value: 'DC', label: 'District of Columbia' },
];

const initialFormState: CheckoutFormState = {
  company: '',
  businessType: '',
  contactName: '',
  email: '',
  phone: '',
  country: 'United States',
  state: '',
  city: '',
  address: '',
  postalCode: '',
  notes: '',
};

export default function CheckoutPage() {
  const { items, subtotal, totalItems, clearCart } = useCart();
  const { isLoggedIn, user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [checkoutError, setCheckoutError] = useState('');
  const [fieldErrors, setFieldErrors] = useState<CheckoutFieldErrors>({});
  const [postalLookup, setPostalLookup] = useState<PostalLookup | null>(null);
  const [isCheckingPostalCode, setIsCheckingPostalCode] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [form, setForm] = useState<CheckoutFormState>(() => ({
    ...initialFormState,
    contactName: user?.name ?? '',
    email: user?.email ?? '',
    phone: formatUsPhoneDisplay(user?.phone ?? ''),
    company: user?.company ?? '',
    businessType: user?.businessType ?? '',
    country: 'United States',
    state: normalizeStateSelection(user?.address?.state ?? ''),
    city: user?.address?.city ?? '',
    address: user?.address?.street ?? '',
    postalCode: user?.address?.zipCode ?? '',
  }));
  const paymentMethod: PaymentMethod = 'bank_transfer';
  const accountPhoneMissing = !user?.phone?.trim();
  const liveFieldErrors = validateCheckoutForm(form, postalLookup);

  const shippingFee = subtotal >= 150 ? 0 : items.length > 0 ? 18 : 0;
  const estimatedTax = subtotal > 0 ? subtotal * 0.08 : 0;
  const orderTotal = subtotal + shippingFee + estimatedTax;

  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login', {
        replace: true,
        state: { from: location.pathname },
      });
    }
  }, [isLoggedIn, navigate, location.pathname]);

  useEffect(() => {
    if (user) {
      setForm((current) => ({
        ...current,
        contactName: current.contactName || user.name,
        email: current.email || user.email,
        phone: current.phone || formatUsPhoneDisplay(user.phone || ''),
        company: current.company || user.company || '',
        businessType: current.businessType || user.businessType || '',
        country: 'United States',
        state: current.state || normalizeStateSelection(user.address?.state || ''),
        city: current.city || user.address?.city || '',
        address: current.address || user.address?.street || '',
        postalCode: current.postalCode || user.address?.zipCode || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    setFieldErrors(validateCheckoutForm(form, postalLookup));
  }, [form, postalLookup]);

  useEffect(() => {
    const zipCode = form.postalCode.trim();
    const primaryZip = zipCode.slice(0, 5);

    if (!token || !/^\d{5}$/.test(primaryZip)) {
      setPostalLookup(null);
      setIsCheckingPostalCode(false);
      return;
    }

    let isCancelled = false;
    setIsCheckingPostalCode(true);

    const timer = window.setTimeout(async () => {
      try {
        const lookup = await lookupUsPostalCode(token, primaryZip);
        if (isCancelled) {
          return;
        }

        setPostalLookup(lookup);
        setForm((current) => {
          if (current.postalCode.trim().slice(0, 5) !== lookup.zipCode) {
            return current;
          }

          const nextState = current.state || lookup.state;
          const nextCity = current.city.trim() ? current.city : lookup.city;

          if (nextState === current.state && nextCity === current.city) {
            return current;
          }

          return {
            ...current,
            state: nextState,
            city: nextCity,
          };
        });
      } catch {
        if (!isCancelled) {
          setPostalLookup(null);
        }
      } finally {
        if (!isCancelled) {
          setIsCheckingPostalCode(false);
        }
      }
    }, 260);

    return () => {
      isCancelled = true;
      window.clearTimeout(timer);
    };
  }, [form.postalCode, token]);

  if (!isLoggedIn) {
    return null;
  }

  const currentUser = user;

  function updateFormField<K extends keyof CheckoutFormState>(key: K, value: CheckoutFormState[K]) {
    setForm((current) => {
      const nextValue =
        key === 'phone'
          ? formatUsPhoneDisplay(String(value))
          : key === 'postalCode'
            ? String(value).replace(/[^\d-]/g, '').slice(0, 10)
            : value;
      const nextForm = { ...current, [key]: nextValue };
      if (checkoutError) {
        setCheckoutError('');
      }
      return nextForm;
    });
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (items.length === 0) {
      return;
    }

    const nextFieldErrors = validateCheckoutForm(form, postalLookup);
    if (Object.keys(nextFieldErrors).length > 0) {
      setFieldErrors(nextFieldErrors);
      setCheckoutError('Please correct the highlighted contact and shipping fields.');
      return;
    }

    setFieldErrors({});

    if (!token || !currentUser) {
      setCheckoutError('Sign in again before placing this order.');
      return;
    }

    const normalizedPhone = normalizeCheckoutPhone(form.phone);
    const trimmedCompany = form.company.trim();
    const trimmedBusinessType = form.businessType.trim();
    const trimmedStreet = compactWhitespace(form.address);
    const trimmedCity = compactWhitespace(form.city);
    const trimmedState = form.state.trim().toUpperCase();
    const trimmedPostalCode = form.postalCode.trim();
    const trimmedCountry = 'United States';
    const normalizedContactName = compactWhitespace(form.contactName);
    const nameParts = normalizedContactName.split(/\s+/).filter(Boolean);
    const nextFirstName = nameParts[0] || currentUser?.firstName || 'Trade';
    const nextLastName = nameParts.slice(1).join(' ');

    const shouldPersistProfile =
      Boolean(token && currentUser) &&
      (
        normalizedPhone !== (currentUser?.phone || '').trim() ||
        normalizedContactName !== (currentUser?.name || '').trim() ||
        trimmedCompany !== (currentUser?.company || '').trim() ||
        trimmedBusinessType !== (currentUser?.businessType || '').trim() ||
        trimmedStreet !== (currentUser?.address?.street || '').trim() ||
        trimmedCity !== (currentUser?.address?.city || '').trim() ||
        trimmedState !== (currentUser?.address?.state || '').trim() ||
        trimmedPostalCode !== (currentUser?.address?.zipCode || '').trim() ||
        trimmedCountry !== ((currentUser?.address?.country || 'United States').trim())
      );

    if (token && currentUser && shouldPersistProfile) {
      try {
        setIsSavingProfile(true);
        const nextUser = await updateTradeProfile(token, {
          firstName: nextFirstName,
          lastName: nextLastName,
          phone: normalizedPhone,
          company: trimmedCompany,
          businessType: trimmedBusinessType,
          address: {
            street: trimmedStreet,
            city: trimmedCity,
            state: trimmedState,
            zipCode: trimmedPostalCode,
            country: trimmedCountry,
          },
        });
        updateUser(nextUser);
      } catch (profileError) {
        setCheckoutError(
          profileError instanceof Error
            ? profileError.message
            : 'Unable to save the mobile number for this account.',
        );
        return;
      } finally {
        setIsSavingProfile(false);
      }
    }

    try {
      setIsPlacingOrder(true);
      setCheckoutError('');

      const createdOrder = await createWholesaleOrder(token, {
        items: items.map((item) => ({
          product: item.productId || null,
          slug: item.slug,
          name: item.name,
          selectedFlavor: item.selectedFlavor,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        shippingInfo: {
          contactName: normalizedContactName,
          email: form.email.trim(),
          phone: normalizedPhone,
          company: trimmedCompany,
          businessType: trimmedBusinessType,
          address: trimmedStreet,
          city: trimmedCity,
          state: trimmedState,
          zipCode: trimmedPostalCode,
          country: trimmedCountry,
        },
        paymentInfo: {
          method: paymentMethod,
        },
        pricing: {
          subtotal,
          shipping: shippingFee,
          tax: estimatedTax,
          total: orderTotal,
        },
        note: form.notes.trim(),
      });

      const placedAt = new Date(createdOrder.placedAt).toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short',
      });

      clearCart();
      navigate('/checkout/success', {
        replace: true,
        state: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          placedAt,
          orderStatus: createdOrder.status,
          paymentStatus: createdOrder.paymentStatus,
          customer: createdOrder.customer || normalizedContactName || currentUser.name,
          email: createdOrder.email || form.email.trim(),
          phone: createdOrder.phone || normalizedPhone,
          company: createdOrder.company || trimmedCompany,
          businessType: createdOrder.businessType || trimmedBusinessType,
          paymentMethod,
          totalItems: createdOrder.items.reduce((sum, item) => sum + item.quantity, 0),
          subtotal: createdOrder.pricing.subtotal,
          shippingFee: createdOrder.pricing.shipping,
          estimatedTax: createdOrder.pricing.tax,
          orderTotal: createdOrder.pricing.total,
          notes: createdOrder.note || form.notes.trim(),
          items: createdOrder.items.map((item) => ({
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            selectedFlavor: item.selectedFlavor,
          })),
          shippingAddress: {
            country: createdOrder.shippingAddress.country,
            state: createdOrder.shippingAddress.state,
            city: createdOrder.shippingAddress.city,
            address: createdOrder.shippingAddress.address,
            postalCode: createdOrder.shippingAddress.postalCode,
          },
        } satisfies InvoiceOrderPayload,
      });
    } catch (orderError) {
      setCheckoutError(
        orderError instanceof Error ? orderError.message : 'Unable to place this wholesale order.',
      );
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return (
    <div className="mx-auto max-w-7xl overflow-x-hidden px-4 py-8 sm:px-6 sm:py-20">
      <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-wrap sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-neutral-500">
            Wholesale Checkout
          </p>
          <h1 className="mt-3 max-w-none whitespace-nowrap text-[1.42rem] font-semibold leading-[0.98] tracking-[-0.03em] text-white sm:max-w-none sm:text-4xl sm:tracking-tight">
            Review wholesale order.
          </h1>
          <p className="mt-3 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:max-w-xl sm:text-sm sm:leading-6 sm:tracking-normal">
            Confirm details before payment.
          </p>
        </div>

        <div className="rounded-[1.15rem] border border-white/10 bg-white/[0.03] px-4 py-2.5 sm:rounded-[1.25rem] sm:px-4 sm:py-3">
          <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Account status</p>
          <div className="mt-2.5 flex items-center gap-2.5 sm:mt-2 sm:gap-3">
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />
            <span className="text-sm text-white">Trade account access confirmed</span>
          </div>
        </div>
      </div>

      {accountPhoneMissing ? (
        <div className="mb-5 rounded-[1.35rem] border border-amber-500/35 bg-amber-500/10 px-4 py-4 text-sm leading-6 text-amber-100 sm:mb-6 sm:rounded-[1.5rem] sm:px-5">
          This account was created without a mobile number. Add a phone number in the contact section below before placing the order.
        </div>
      ) : null}

      {items.length === 0 ? (
        <div className="rounded-[1.75rem] border border-white/10 bg-neutral-950 p-6 sm:rounded-[2rem] sm:p-8">
          <p className="text-neutral-400">
            Your order review is empty. Add products before submitting a wholesale order.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink to="/products">Review catalog</ButtonLink>
            <ButtonLink to="/cart" variant="secondary">
              Back to order review
            </ButtonLink>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 sm:gap-8 xl:grid-cols-[1.12fr,0.88fr]">
          <form
            id="checkout-form"
            onSubmit={handleSubmit}
            className="min-w-0 rounded-[1.75rem] border border-white/10 bg-neutral-950 p-4 sm:rounded-[2rem] sm:p-7"
          >
            <div className="grid gap-5">
              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <SectionHeader
                  eyebrow="01"
                  title="Contact information"
                  description="Use one contact for order and shipping."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <Field
                    label="Contact name"
                    value={form.contactName}
                    onChange={(value) => updateFormField('contactName', value)}
                    placeholder="Business contact"
                    required
                    autoComplete="name"
                    error={fieldErrors.contactName}
                  />
                  <Field
                    label="Email (optional)"
                    type="email"
                    value={form.email}
                    onChange={(value) => updateFormField('email', value)}
                    placeholder="orders@yourstore.com"
                    autoComplete="email"
                    error={fieldErrors.email}
                  />
                  <Field
                    label="Phone"
                    value={form.phone}
                    onChange={(value) => updateFormField('phone', value)}
                    placeholder={accountPhoneMissing ? 'Add your mobile number' : '+1 (555) 000-0000'}
                    required
                    inputMode="tel"
                    autoComplete="tel"
                    hint={
                      accountPhoneMissing
                        ? 'Required before wholesale order submission.'
                        : undefined
                    }
                    error={fieldErrors.phone}
                  />
                  <div className="hidden min-w-0 rounded-[1.15rem] border border-white/10 bg-black px-4 py-3 sm:block sm:rounded-[1.25rem]">
                    <p className="text-xs uppercase tracking-[0.22em] text-neutral-500">Account</p>
                    <p className="mt-2 text-sm text-white">
                      {user?.name ?? 'Store Purchasing Contact'}
                    </p>
                    <p className="mt-1 break-all text-sm text-neutral-400 sm:break-words">
                      {user?.email ?? 'No email available'}
                    </p>
                  </div>
                </div>
              </section>

              <section className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <SectionHeader
                  eyebrow="02"
                  title="Shipping address"
                  description="Add the delivery address."
                />

                <div className="grid gap-4 md:grid-cols-2">
                  <StaticField label="Country" value="United States only" />
                  <SelectField
                    label="State"
                    value={form.state}
                    onChange={(value) => updateFormField('state', value)}
                    options={US_STATE_OPTIONS}
                    placeholder="Select state"
                    required
                    error={fieldErrors.state}
                  />
                  <Field
                    label="City"
                    value={form.city}
                    onChange={(value) => updateFormField('city', value)}
                    placeholder={postalLookup?.city || 'Los Angeles'}
                    required
                    autoComplete="address-level2"
                    list={postalLookup ? 'checkout-city-suggestions' : undefined}
                    hint={
                      isCheckingPostalCode
                        ? 'Checking ZIP and city match...'
                        : postalLookup
                          ? normalizeCityForComparison(form.city) &&
                            normalizeCityForComparison(form.city) !==
                              normalizeCityForComparison(postalLookup.city)
                            ? `Recommended city for ZIP ${postalLookup.zipCode}: ${postalLookup.city}, ${postalLookup.state}.`
                            : `ZIP ${postalLookup.zipCode} matches ${postalLookup.city}, ${postalLookup.state}.`
                          : undefined
                    }
                    error={fieldErrors.city}
                  />
                  <Field
                    label="Postal code"
                    value={form.postalCode}
                    onChange={(value) => updateFormField('postalCode', value)}
                    placeholder="90001"
                    required
                    inputMode="numeric"
                    autoComplete="postal-code"
                    error={fieldErrors.postalCode}
                  />
                </div>
                {postalLookup ? (
                  <datalist id="checkout-city-suggestions">
                    <option value={postalLookup.city} />
                  </datalist>
                ) : null}

                <div className="mt-4">
                  <Field
                    label="Street address"
                    value={form.address}
                    onChange={(value) => updateFormField('address', value)}
                    placeholder="Store, warehouse, or receiving location"
                    required
                    autoComplete="street-address"
                    error={fieldErrors.address}
                  />
                </div>
              </section>

              <details className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <summary className="flex cursor-pointer list-none flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      03
                    </p>
                    <h2 className="mt-2 max-w-none whitespace-nowrap text-[1.08rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:max-w-none sm:text-xl sm:tracking-normal">
                      Company or reseller details
                    </h2>
                    <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-none sm:text-sm sm:leading-6 sm:tracking-normal">
                      Add company or business details.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                    Optional
                  </span>
                </summary>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <Field
                    label="Company"
                    value={form.company}
                    onChange={(value) => updateFormField('company', value)}
                    placeholder="Store, distributor, or company name"
                  />
                  <Field
                    label="Business type"
                    value={form.businessType}
                    onChange={(value) => updateFormField('businessType', value)}
                    placeholder="Retail store, distributor, reseller"
                  />
                </div>
              </details>

              <details className="rounded-[1.35rem] border border-white/10 bg-white/[0.02] p-4 sm:rounded-[1.5rem] sm:p-5">
                <summary className="flex cursor-pointer list-none flex-col items-start justify-between gap-3 text-left sm:flex-row sm:items-center sm:gap-4">
                  <div className="min-w-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                      04
                    </p>
                    <h2 className="mt-2 whitespace-nowrap text-[1.12rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:text-xl sm:tracking-normal">
                      Order notes
                    </h2>
                    <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-2xl sm:text-sm sm:leading-6 sm:tracking-normal">
                      Add optional delivery or billing notes.
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-neutral-400 sm:text-xs">
                    Optional
                  </span>
                </summary>

                <label className="mt-5 block text-sm text-neutral-300">
                  Notes
                  <textarea
                    value={form.notes}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, notes: event.target.value }))
                    }
                    rows={2}
                    placeholder="Store delivery note or reseller follow-up request"
                    className="mt-2 min-h-[96px] w-full rounded-[1.15rem] border border-white/10 bg-black px-4 py-3 text-white outline-none placeholder:text-neutral-500 sm:min-h-0 sm:rounded-[1.25rem]"
                  />
                </label>
              </details>

              <section className="hidden rounded-[1.75rem] border border-white/10 bg-white/[0.03] p-5 sm:p-6">
                <SectionHeader
                  eyebrow="Order review"
                  title="Review items before placing the order"
                  description="A tighter summary keeps the final payment-ready step clear."
                />
                <div className="mt-5 space-y-4">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between gap-4 border-b border-white/10 pb-4"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-16 w-16 rounded-2xl object-cover"
                        />
                        <div>
                          <p className="font-medium text-white">{item.name}</p>
                          <p className="mt-1 text-sm text-neutral-400">
                            {item.selectedFlavor ? `${item.selectedFlavor} · ` : ''}Qty {item.quantity}
                          </p>
                        </div>
                      </div>
                      <p className="text-sm font-medium text-white">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>
              </section>
            </div>
          </form>

          <aside className="min-w-0 rounded-[1.75rem] border border-white/10 bg-gradient-to-b from-white/[0.08] to-white/[0.02] p-4 shadow-[0_24px_80px_rgba(0,0,0,0.35)] sm:h-fit sm:rounded-[2rem] sm:p-6">
            <div className="rounded-[1.35rem] border border-white/10 bg-black/70 p-4 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Wholesale order summary
              </p>
              <div className="mt-5 space-y-4 text-sm text-neutral-300">
                <Row label="Units" value={String(totalItems)} />
                <Row label="Subtotal" value={`$${subtotal.toFixed(2)}`} />
                <Row
                  label="Shipping"
                  value={shippingFee === 0 ? 'Free shipping' : `$${shippingFee.toFixed(2)}`}
                />
                <Row label="Estimated tax" value={`$${estimatedTax.toFixed(2)}`} />
              </div>
              <div className="mt-6 border-t border-white/10 pt-6">
                <div className="flex items-center justify-between text-[1.95rem] font-semibold leading-none text-white sm:text-xl">
                  <span>Order total</span>
                  <span>${orderTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="mt-5 space-y-3 border-t border-white/10 pt-5">
                {items.slice(0, 2).map((item) => (
                  <div key={item.id} className="grid gap-2.5 text-sm sm:flex sm:items-center sm:justify-between sm:gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 rounded-xl border border-white/10 object-cover sm:h-12 sm:w-12"
                      />
                      <div className="min-w-0">
                        <p className="truncate pr-2 text-[13px] text-white sm:pr-0 sm:text-sm">{item.name}</p>
                        <p className="text-neutral-500">
                          {item.selectedFlavor ? `${item.selectedFlavor} · ` : ''}Qty {item.quantity}
                        </p>
                      </div>
                    </div>
                    <span className="pl-14 text-[13px] text-neutral-300 sm:pl-0 sm:text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
                {items.length > 2 ? (
                  <p className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                    +{items.length - 2} more items
                  </p>
                ) : null}
              </div>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-black p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Trade account
              </p>
              <p className="mt-3 text-white">{user?.name ?? 'Store Purchasing Contact'}</p>
              <p className="mt-1 break-all text-sm text-neutral-400 sm:break-words">{user?.email ?? 'No email available'}</p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Payment method
              </p>
              <div className="mt-4 rounded-[1.15rem] border border-white/30 bg-white/[0.05] px-4 py-3 sm:rounded-[1.25rem]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">Bank transfer</p>
                    <p className="mt-1 text-sm leading-6 text-neutral-400">
                      Place the order first, then complete payment offline with the invoice and
                      bank details provided for this order.
                    </p>
                  </div>
                  <span className="mt-1 h-4 w-4 rounded-full border border-white bg-white" />
                </div>
              </div>
              <p className="mt-3 text-xs leading-5 text-neutral-500">
                Credit or debit card payment can be connected later if you want to add an online
                payment link.
              </p>
            </div>

            <div className="mt-4 rounded-[1.35rem] border border-white/10 bg-white/[0.03] p-4 sm:mt-5 sm:rounded-[1.5rem] sm:p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
                Order submission
              </p>
              <p className="mt-3 text-sm leading-6 text-neutral-400">
                Place the order to generate the bank-transfer step and prepare the invoice details.
              </p>
            </div>

            {checkoutError ? (
              <div className="mt-4 rounded-[1.15rem] border border-red-500/35 bg-red-950/20 px-4 py-3 text-sm leading-6 text-red-300 sm:mt-5 sm:rounded-[1.25rem]">
                {checkoutError}
              </div>
            ) : null}

            <div className="mt-5 flex flex-col gap-3 sm:mt-6">
              <button
                type="submit"
                form="checkout-form"
                className="inline-flex items-center justify-center rounded-full border border-white bg-white px-5 py-3 text-sm font-medium text-black transition hover:bg-neutral-100"
                disabled={isSavingProfile || isPlacingOrder || Object.keys(liveFieldErrors).length > 0}
              >
                {isSavingProfile
                  ? 'Saving contact details...'
                  : isPlacingOrder
                    ? 'Placing order...'
                    : 'Place order'}
              </button>
              <ButtonLink to="/cart" variant="secondary">
                Back to order review
              </ButtonLink>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}

function SectionHeader({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="mb-4 border-b border-white/10 pb-4">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] text-neutral-500">
        {eyebrow}
      </p>
      <h2 className="mt-2 max-w-none whitespace-nowrap text-[1.12rem] font-semibold leading-[1.02] tracking-[-0.02em] text-white sm:max-w-none sm:text-xl sm:tracking-normal">{title}</h2>
      <p className="mt-2 max-w-none whitespace-nowrap text-[11px] leading-5 tracking-[-0.01em] text-neutral-400 sm:mt-1 sm:max-w-2xl sm:text-sm sm:leading-6 sm:tracking-normal">{description}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  required,
  type = 'text',
  hint,
  error,
  inputMode,
  autoComplete,
  list,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  required?: boolean;
  type?: string;
  hint?: string;
  error?: string;
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  autoComplete?: string;
  list?: string;
}) {
  return (
    <label className="block text-sm text-neutral-300">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        inputMode={inputMode}
        autoComplete={autoComplete}
        list={list}
        className={`mt-2 h-11 w-full min-w-0 rounded-[1.15rem] border bg-black px-4 py-3 text-[15px] text-white outline-none placeholder:text-neutral-500 sm:rounded-[1.25rem] ${
          error ? 'border-red-500/50' : 'border-white/10'
        }`}
      />
      {hint ? <span className="mt-2 block text-xs leading-5 text-amber-200">{hint}</span> : null}
      {error ? <span className="mt-2 block text-xs leading-5 text-red-300">{error}</span> : null}
    </label>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  required,
  error,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{ value: string; label: string }>;
  placeholder: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <label className="block text-sm text-neutral-300">
      {label}
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className={`mt-2 h-11 w-full min-w-0 rounded-[1.15rem] border bg-black px-4 py-3 text-[15px] text-white outline-none sm:rounded-[1.25rem] ${
          error ? 'border-red-500/50' : 'border-white/10'
        }`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error ? <span className="mt-2 block text-xs leading-5 text-red-300">{error}</span> : null}
    </label>
  );
}

function StaticField({ label, value }: { label: string; value: string }) {
  return (
    <div className="block text-sm text-neutral-300">
      {label}
      <div className="mt-2 flex h-11 items-center rounded-[1.15rem] border border-white/10 bg-black px-4 text-[15px] text-neutral-300 sm:rounded-[1.25rem]">
        {value}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 text-sm">
      <span>{label}</span>
      <span className="text-right text-white">{value}</span>
    </div>
  );
}

function compactWhitespace(value: string) {
  return value.trim().replace(/\s+/g, ' ');
}

function normalizeCheckoutPhone(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';
  const normalized = trimmed.replace(/[^\d+]/g, '');
  if (!normalized) return '';
  return normalized.startsWith('+') ? normalized : normalized.replace(/[^\d]/g, '');
}

function formatUsPhoneDisplay(value: string) {
  const normalized = normalizeCheckoutPhone(value);
  if (!normalized) return '';

  const digitsOnly = normalized.replace(/[^\d]/g, '');
  const isUsWithCountry = digitsOnly.length === 11 && digitsOnly.startsWith('1');
  const localDigits = isUsWithCountry ? digitsOnly.slice(1) : digitsOnly.slice(0, 10);

  if (!localDigits) return '';

  const area = localDigits.slice(0, 3);
  const prefix = localDigits.slice(3, 6);
  const line = localDigits.slice(6, 10);

  if (localDigits.length <= 3) {
    return area;
  }

  if (localDigits.length <= 6) {
    return `(${area}) ${prefix}`;
  }

  const formatted = `(${area}) ${prefix}-${line}`;
  return isUsWithCountry ? `+1 ${formatted}` : formatted;
}

function normalizeStateSelection(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return '';

  const uppercase = trimmed.toUpperCase();
  if (US_STATE_OPTIONS.some((option) => option.value === uppercase)) {
    return uppercase;
  }

  const matched = US_STATE_OPTIONS.find(
    (option) => option.label.toLowerCase() === trimmed.toLowerCase(),
  );

  return matched?.value ?? '';
}

function normalizeCityForComparison(value: string) {
  return compactWhitespace(value)
    .toLowerCase()
    .replace(/\./g, '')
    .replace(/\s+/g, ' ');
}

function validateCheckoutForm(
  form: CheckoutFormState,
  postalLookup: PostalLookup | null,
): CheckoutFieldErrors {
  const errors: CheckoutFieldErrors = {};
  const contactName = compactWhitespace(form.contactName);
  const email = compactWhitespace(form.email).toLowerCase();
  const phone = normalizeCheckoutPhone(form.phone);
  const city = compactWhitespace(form.city);
  const address = compactWhitespace(form.address);
  const postalCode = form.postalCode.trim();
  const state = form.state.trim().toUpperCase();

  if (contactName.length < 2 || !/\p{L}/u.test(contactName)) {
    errors.contactName = 'Use a valid contact name.';
  }

  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Use a valid email address.';
  }

  if (!phone || !/^\+?[1-9]\d{9,14}$/.test(phone)) {
    errors.phone = 'Use a valid mobile number.';
  }

  if (!state) {
    errors.state = 'Select a U.S. state.';
  }

  if (city.length < 2 || !/\p{L}/u.test(city) || !/^[A-Za-z .'-]+$/.test(city)) {
    errors.city = 'Use a valid city name.';
  }

  if (!/^\d{5}(?:-\d{4})?$/.test(postalCode)) {
    errors.postalCode = 'Use a valid U.S. ZIP code.';
  }

  if (postalLookup && /^\d{5}$/.test(postalCode.slice(0, 5))) {
    if (postalLookup.state !== state) {
      errors.state = `ZIP ${postalLookup.zipCode} belongs to ${postalLookup.state}.`;
    }

  }

  if (
    address.length < 8 ||
    !/\p{L}/u.test(address) ||
    !/^\d+[A-Za-z0-9-]*\s+.+$/u.test(address)
  ) {
    errors.address = 'Enter a full street address starting with a street number.';
  }

  return errors;
}
