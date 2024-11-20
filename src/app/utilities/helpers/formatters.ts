export const formattedDate = (date?: string | null) => {
  if (date) {
    const toFormatDate = new Date(date);
    const day = String(toFormatDate.getUTCDate()).padStart(2, "0");
    const month = toFormatDate.toLocaleString("es-ES", {
      month: "short",
      timeZone: "UTC",
    });
    const year = toFormatDate.getUTCFullYear();

    return `${day} ${month} ${year}`;
  }
};
