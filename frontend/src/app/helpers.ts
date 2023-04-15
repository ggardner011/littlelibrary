export const getAxiosError = (error: any) => {
  return (
    (error.response && error.response.data) ||
    (error.response && error.response.data && error.response.data.message) ||
    error.message ||
    error.toString()
  );
};

export const getDisplayDate = (date: string) => {
  const dateString = date.substring(0, 10);
  const dateParts = dateString.split("-");
  const year = dateParts[0];
  const month = dateParts[1];
  const day = dateParts[2];
  const formattedDate = `${month}/${day}/${year}`;

  return formattedDate;
};
