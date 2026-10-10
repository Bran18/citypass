# Loyalty rules

Phase 4, not an enabled first-milestone feature. No demo point balances, fictional coupons or unsupported redemption controls are shown.

Every earning, redemption, reversal and expiration is an immutable ledger entry. Balance is a sum over the appropriate program/funding scope, never a freely editable number. Corrections append compensating entries. Use integer points and integer monetary minor units with explicit ISO currency on purchases. Never assign points an arbitrary cash conversion.

Default rewards are merchant funded. Funding organization and campaign budget must be explicit. Cross-merchant spending is disabled until a settlement agreement exists. Earning rules are versioned and saved with verified purchases. Expiration is configurable and executed as ledger events by an idempotent job. Concurrent redemption must lock the spendable account and re-evaluate balance in the same transaction.

Before implementation, agree reward funding, cap, validity, refund behavior, expiry notice and accounting reconciliation with the pilot partners. Add authorization, insufficient balance, replay, expiry and independent-connection concurrency tests before enabling any redemption.
