export default function getVevetProperties(data) {

    let vevetApplication = window.vevetApplication;

    if (typeof data == "undefined") {
        data = {
            v: vevetApplication
        };
    }
    else {
        if (typeof data.v == "undefined") {
            data.v = vevetApplication;
        }
    }

    return data;

}