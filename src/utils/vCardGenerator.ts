export const generateVCard = (data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  status: string;
}) => {
  const vCard = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `N:${data.lastName};${data.firstName};;;`,
    `FN:${data.firstName} ${data.lastName}`,
    `TEL;TYPE=CELL:${data.phone}`,
    `EMAIL:${data.email}`,
    `TITLE:${data.status}`,
    'END:VCARD'
  ].join('\n');

  return vCard;
};