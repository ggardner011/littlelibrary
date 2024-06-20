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

export const parseJwt = (token: string) => {
  try {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
};
