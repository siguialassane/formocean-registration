export const generateVCard = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}) => {
  // Ensure proper escaping of special characters
  const escapedFirstName = data.firstName.replace(/[,;]/g, '\\$&');
  const escapedLastName = data.lastName.replace(/[,;]/g, '\\$&');
  const escapedStatus = data.status.replace(/[,;]/g, '\\$&');

  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${escapedLastName};${escapedFirstName};;;`,
    `FN:${escapedFirstName} ${escapedLastName}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `TITLE:${escapedStatus}`,
    'END:VCARD'
  ].join('\r\n');

  return vCard;
};