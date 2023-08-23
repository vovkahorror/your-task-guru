export const toFormatDate = (date: string | Date, locale = 'en-GB') => {
    return new Date(date).toLocaleDateString(locale, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

export const toFormatTime = (date: string | Date, locale = 'en-GB') => {
    return new Date(date).toLocaleTimeString(locale, {
        hour: 'numeric',
        minute: 'numeric',
        hour12: false,
    });
};