export function transposeHeadings (md) {
    let desc = md.replace(/(.*?)(\n===+)/g,`# $1`);
    desc = desc.replace(/(.*?)(\n---+)/g,`## $1`);
    const re = /(#+)/gm;
    desc = desc.replace(re, `$1## `);

    return desc;
}

export function urlToLink(md) {
    const reUrl = /([^[(])(https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}[-a-zA-Z0-9@:%_+.~#?&//=]*)([^\])])/g
    return md.replace(reUrl, '$1[$2]($2)$3');  
}

export function beatifyScienceTerms(md) {
    let desc =  md.replace(/CO2/g,"CO₂");
    return desc;
}