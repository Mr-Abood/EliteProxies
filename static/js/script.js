var page = 0;

function millisecondsToStr (milliseconds) {
    function numberEnding (number) {
        return (number > 1) ? 's' : '';
    }
    var temp = Math.floor(milliseconds / 1000);
    var years = Math.floor(temp / 31536000);
    if (years) {
        return years + ' year' + numberEnding(years);
    }
    var days = Math.floor((temp %= 31536000) / 86400);
    if (days) {
        return days + ' day' + numberEnding(days);
    }
    var hours = Math.floor((temp %= 86400) / 3600);
    if (hours) {
        return hours + ' hour' + numberEnding(hours);
    }
    var minutes = Math.floor((temp %= 3600) / 60);
    if (minutes) {
        return minutes + ' minute' + numberEnding(minutes);
    }
    var seconds = temp % 60;
    if (seconds) {
        return seconds + ' second' + numberEnding(seconds);
    }
    return 'less than a second';
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function parseTF(bool) {
    if (bool) {
        return '<span class="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" height="13" width="15" viewBox="0 0 448 512"><path fill="#63E6BE" d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/></svg></span>';
    }
    else {
        return '<span class="flex justify-center"><svg xmlns="http://www.w3.org/2000/svg" height="13" width="15" viewBox="0 0 384 512"><path fill="#ff0000" d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg></span>';
    }
}

function insertProxiesToTable(proxies) {
    var table = document.getElementById("proxies");
    table.innerHTML = '';
    for (i in proxies) {
        var row = table.insertRow(-1);
        row.insertCell(0).innerHTML = proxies[i]["ip"];
        row.insertCell(1).innerHTML = proxies[i]["port"];
        row.insertCell(2).innerHTML = '<img class="rounded-full w-5 h-5 mr-2" src="https://flags.fmcdn.net/data/flags/mini/'+proxies[i]["location"]["country"]["code"].toLowerCase()+'.png">'+proxies[i]["location"]["country"]["code"];
        row.cells[2].setAttribute("class", "flex items-center")
        row.insertCell(3).innerHTML = '<span class="flex justify-center">'+capitalizeFirstLetter(proxies[i]["protocol"])+'</span>';
        row.insertCell(4).innerHTML = '<span class="flex justify-center">'+capitalizeFirstLetter(proxies[i]["anonymity"])+'</span>';
        row.insertCell(5).innerHTML = parseTF(proxies[i]["residential"]);
        row.insertCell(6).innerHTML = parseTF(proxies[i]["rotating"]);
        row.insertCell(7).innerHTML = parseTF(proxies[i]["support"]["https"]);
        row.insertCell(8).innerHTML = parseTF(proxies[i]["support"]["cookies"]);
        row.insertCell(9).innerHTML = parseTF(proxies[i]["support"]["headers"]);
        row.insertCell(10).innerHTML = parseTF(proxies[i]["support"]["user-agent"]);
        row.insertCell(11).innerHTML = parseTF(proxies[i]["support"]["websites"]["google"]);
        row.insertCell(12).innerHTML = parseTF(proxies[i]["support"]["websites"]["amazon"]);
        row.insertCell(13).innerHTML = parseTF(proxies[i]["support"]["websites"]["telegram"]);
        row.insertCell(14).innerHTML = '<span class="inline-flex items-center gap-x-1 py-1 px-2 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-800/30 dark:text-green-500"><span class="size-1.5 inline-block rounded-full bg-green-800 dark:bg-green-500"></span>'+proxies[i]["speed"]*10+"ms"+'</span>';
        row.insertCell(15).innerHTML = proxies[i]["uptime"]+"%";
        var now = new Date;
        var timestamp = Date.UTC(now.getUTCFullYear(),now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds());
        row.insertCell(16).innerHTML = millisecondsToStr(timestamp-(proxies[i]["last_check"]*1000));
        row.cells[16].setAttribute("class", "whitespace-nowrap")
    }
}

function changePage(n) {
    page+=n;
    fetch("/api/rows_count").then(response => response.text()).then(data => {
        document.getElementById("rows_count").innerText = data;
        if ((page*50)+50 >= parseInt(data)) {
            document.getElementById("nextbtn").disabled = true;
        }
        else {
            document.getElementById("nextbtn").disabled = false;
        }
        if (page <= 0) {
            document.getElementById("previousbtn").disabled = true;
        }
        else {
            document.getElementById("previousbtn").disabled = false;
        }
    });
    fetch("/api/get_proxies?page="+page).then(response => response.json()).then(data => {
        var proxies = data["proxies"];
        insertProxiesToTable(proxies);
        document.getElementById("pages").innerText = page*50+" - "+((page*50)+50)
    });
}

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById("previousbtn").disabled = true;
    document.getElementById("pages").innerText = page*50+" - "+((page*50)+50)
    fetch("/api/rows_count").then(response => response.text()).then(data => {
        document.getElementById("rows_count").innerText = data;
    });
    fetch("/api/get_proxies").then(response => response.json()).then(data => {
        var proxies = data["proxies"];
        insertProxiesToTable(proxies);
    });
});