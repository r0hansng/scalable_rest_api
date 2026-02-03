export const TRANSACTION_STATUS = {
  PENDING: 'PENDING',     // Created, not yet finalized
  SUCCESS: 'SUCCESS',     // Fully committed
  FAILED: 'FAILED',       // Explicitly failed (insufficient funds, validation)
  REVERSED: 'REVERSED',    // Rolled back / compensated
};
