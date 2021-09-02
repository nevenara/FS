export enum CheckInFailureReasonType {
    QrAlreadyScanned = 'QR Code already scanned',
    QrInvalid = 'QR Code invalid / unknown',
    NoMatch = 'No Match Ticket ID / Name',
    NoFacematch = 'No Facematch - manual check'
}