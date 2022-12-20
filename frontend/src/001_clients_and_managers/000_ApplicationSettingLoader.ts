
export type ApplicationSetting =
    {
        "app_title": string,
    }

export const InitialApplicationSetting = require("../../public/assets/setting.json")

export const fetchApplicationSetting = async (): Promise<ApplicationSetting> => {
    const url = `./assets/setting.json`
    const res = await fetch(url, {
        method: "GET"
    });
    const setting = await res.json() as ApplicationSetting
    return setting;
}
