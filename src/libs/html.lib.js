const isEmpty = (html) => {
    while (/[\r\t\f\v ]/.test(html)) {
        html = html.replace(new RegExp(/[\r\t\f\v ]/), '');
    }

    return html.length > 0 ? false : true;
}

const removeBlanks = (html) => {
    while (/[\r\t\f\v]/.test(html)) {
        html = html.replace(new RegExp(/[\r\t\f\v]/), '');
    }

    while (/(\n\n)/.test(html)) {
        html = html.replace(new RegExp(/(\n\n)/), '\n');
    }

    while (/(  )/.test(html)) {
        html = html.replace(new RegExp(/(  )/), '');
    }
    while (/(   )/.test(html)) {
        html = html.replace(new RegExp(/(   )/), '');
    }
    while (/(    )/.test(html)) {
        html = html.replace(new RegExp(/(    )/), '');
    }

    return html;
}

const readLines = (html) => {
    const lines = [];
    let remaining = html;

    while (remaining.length > 0) {
        let index = remaining.indexOf('\n');
        let line  = remaining.substring(0, index);

        if(!isEmpty(line)) {
            remaining = remaining.substring(index + 1);
            lines.push(line);
        } else {
            remaining = remaining.substring(line.length + 1);
        }
        
    }
    return lines;
}

const removeTags = (string) => {
    let formatted = string.substring(
        string.indexOf(">") + 1, 
        string.lastIndexOf("<"));

    return formatted;
}

const getForm = (html) => {
    let form = html.substring(
        html.indexOf("<form"), 
        html.lastIndexOf("</form>"));

    let formatted = removeBlanks(form)
    
    return readLines(formatted);
}

module.exports = {
    isEmpty,
    removeBlanks,
    removeTags,
    readLines,
    getForm
}