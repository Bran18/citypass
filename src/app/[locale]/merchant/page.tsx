import { WorkspaceAccess } from '@/components/workspace-access';
import { destinationId } from '@/lib/catalog';
import { getSelectedDestination } from '@/lib/destination-context/server';
import { randomUUID } from 'node:crypto';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';
import { createClient, session } from '@/lib/supabase/server';
import { getDestinationDirectory } from '@/lib/destinations';
import { checked, localizedText } from '@/lib/data';
import { MerchantForm } from '@/components/payments/merchant-form';
export default async function Merchant({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const [t, user, selected] = await Promise.all([
    getTranslations(),
    session(),
    getSelectedDestination(),
  ]);
  if (!user)
    return (
      <WorkspaceAccess
        locale={locale}
        title={t('payments.merchant')}
        body={t('payments.merchantBody')}
        kind="merchant"
      />
    );
  const db = await createClient();
  const [orgsResult, payoutsResult, requestsResult, directory] = await Promise.all([
    db
      .from('organizations')
      .select('id,name,status,destination_id')
      .eq('kind', 'merchant')
      .eq('destination_id', selected?.id ?? destinationId),
    db.from('merchant_payouts').select('organization_id,address'),
    db
      .from('checkout_requests')
      .select('id,organization_id,product,amount,status,created_at')
      .eq('destination_id', selected?.id ?? destinationId)
      .order('created_at', { ascending: false })
      .limit(50),
    getDestinationDirectory(),
  ]);
  const orgs = checked(orgsResult),
    payouts = checked(payoutsResult),
    requests = checked(requestsResult);
  return (
    <section className="section workspace-page">
      <div className="page-heading">
        <h1>{t('payments.merchant')}</h1>
        <p>{t('payments.merchantBody')}</p>
      </div>
      <details className="pass-details">
        <summary>{t('payments.networkDetails')}</summary>
        <p>{t('pollar.testnet')}</p>
      </details>
      {orgs.map((org) => {
        const payout = payouts.find((item) => item.organization_id === org.id);
        const history = requests.filter((item) => item.organization_id === org.id);
        return (
          <section className="merchant-business" key={org.id}>
            <h2>{org.name}</h2>
            <p>{t(`review.statuses.${org.status}`)}</p>
            <p>
              {localizedText(
                directory?.destinations.find((item) => item.id === org.destination_id)?.names,
                locale,
              )}
            </p>
            {org.status !== 'approved' ? (
              <p>{t('payments.approvalRequired')}</p>
            ) : (
              <>
                {payout ? (
                  <p className="wallet-reference">
                    {t('payments.payout')}: {payout.address}
                  </p>
                ) : (
                  <MerchantForm locale={locale} action="payout" label={t('payments.useWallet')}>
                    <input type="hidden" name="organization_id" value={org.id} />
                    <p>{t('payments.payoutNote')}</p>
                  </MerchantForm>
                )}
                {payout ? (
                  <MerchantForm locale={locale} action="create" label={t('payments.create')}>
                    <input type="hidden" name="organization_id" value={org.id} />
                    <input type="hidden" name="idempotency_key" value={randomUUID()} />
                    <label>
                      {t('payments.product')}
                      <input name="product" required maxLength={180} />
                    </label>
                    <label>
                      {t('payments.amount')}
                      <input
                        name="amount"
                        inputMode="decimal"
                        required
                        pattern="(0|[1-9][0-9]{0,11})(\.[0-9]{1,7})?"
                      />
                    </label>
                    <p>{t('payments.fees')}</p>
                  </MerchantForm>
                ) : null}
              </>
            )}
            <h3>{t('payments.history')}</h3>
            <p>
              {t('payments.confirmedCount', {
                count: history.filter((item) => item.status === 'confirmed').length,
              })}
            </p>
            {history.length ? (
              <ul className="checkout-history">
                {history.map((item) => (
                  <li key={item.id}>
                    <Link href={`/${locale}/checkout/${item.id}`}>{item.product}</Link>
                    <span>{item.amount} USDC</span>
                    <span>{t(`payments.status.${item.status}`)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p>{t('payments.noPayments')}</p>
            )}
          </section>
        );
      })}
      <section className="narrow">
        <h2>{t('payments.register')}</h2>
        <p>{t('payments.approvalRequired')}</p>
        <MerchantForm locale={locale} action="onboard" label={t('payments.register')}>
          <label>
            {t('payments.businessName')}
            <input name="name" required minLength={2} maxLength={120} />
          </label>
          <label>
            {t('destinations.title')}
            <select name="destination_id" required defaultValue={selected?.id ?? ''}>
              <option value="" disabled>
                {t('payments.chooseDestination')}
              </option>
              {directory?.destinations.map((destination) => (
                <option key={destination.id} value={destination.id}>
                  {localizedText(destination.names, locale)}
                </option>
              ))}
            </select>
          </label>
        </MerchantForm>
      </section>
    </section>
  );
}
