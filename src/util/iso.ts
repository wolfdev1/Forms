const url = 'https://gist.githubusercontent.com/jrnk/8eb57b065ea0b098d571/raw/936a6f652ebddbe19b1d100a60eedea3652ccca6/ISO-639-1-language.json';

export async function isValidLanguageCode(inputCode: string): Promise<boolean> {

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                return false;
            }
            return response.json();
        })
        .then(languages => {

            return languages.some(language => language.code === inputCode);
        })
        .catch(() => {

            return false;
        });
}