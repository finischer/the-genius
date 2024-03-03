export const crateRandomUserName = () => {
    const randomID = Math.floor(Math.random() * 1000);

    return `User #${randomID}`
}