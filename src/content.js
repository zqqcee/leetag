const baseURL = "https://leetcode.cn/problems/";
const contestURL = "https://leetcode.cn/contest/weekly-contest-192";
const url = window.location.href;
const title = url.replace(baseURL, "").replace("/", "");
const uniqueTagId = "tag_unique_zqqcee"; //判断tags按钮是否存在
const uniqueHintsId = "hints_unique_zqqcee"//判断hints是否存在

let toolBarClassName = "css-1e1vffy-Tools";
let titleClassName = "css-10c1h40-Title";


const handleResult = (data) => {
    let info = {};
    info.isBeta = data.isBeta.data.userBetaStatusV2.inBeta;
    info.question = data.leetcodeTagsAndHints.data.question;
    info.weeklyContest = data.weeklyContest;
    return info;
}

const getData = async () => {
    try {
        const result = await chrome.runtime.sendMessage({ action: "getData", title });
        return result;
    } catch (e) {
        const result = await fetchData(title);
        return result;
    }
}

/**
 * 创建tags按钮
 */
const createTagButton = (info) => {
    const addTag = (info) => {
        const { topicTags } = info;
        const div = document.createElement('div');
        div.id = uniqueTagId;
        div.className = "tags";
        topicTags.forEach(tag => {
            const a = document.createElement('a');
            a.href = `/tag/${tag.slug}`;
            a.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60";
            const txt = document.createElement('span');
            txt.innerHTML = `${tag.translatedName}`;
            a.appendChild(txt);
            div.appendChild(a);
        })
        document.querySelector(`.${titleClassName}`).appendChild(div);
    }
    const removeTag = () => {
        document.querySelector(`#${uniqueTagId}`).remove();
    }
    let button = document.createElement("a");
    // button.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60"
    button.className = "button";
    let buttontxt = document.createElement('span');
    buttontxt.id = "leetag_tagsbuttontxt";
    buttontxt.innerHTML = "tags";
    button.appendChild(buttontxt);

    button.onclick = () => {
        if (document.querySelector(`#${uniqueTagId}`)) {
            removeTag();
            document.querySelector("#leetag_tagsbuttontxt").innerHTML = "tags";
        } else {
            addTag(info);
            document.querySelector("#leetag_tagsbuttontxt").innerHTML = "hideT";
        }
    }

    document.querySelector(`.${toolBarClassName}`).appendChild(button);
}

const createHintsButton = (info) => {
    const { hints } = info;
    let button = document.createElement("a");
    button.className = "button";
    let buttontxt = document.createElement('span');
    buttontxt.id = "leetag_hintsbuttontxt";
    buttontxt.innerHTML = "hints";
    button.appendChild(buttontxt);

    const addHints = (hints) => {
        const div = document.createElement('div');
        div.id = uniqueHintsId;
        div.className = "hints";
        const ul = document.createElement('ul');
        if (hints.length != 0) {
            hints.forEach(h => {
                const li = document.createElement('li');
                li.innerHTML = h;
                ul.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.className = 'hintsNotFound';
            li.innerHTML = "sorry, no hints :( ";
            ul.appendChild(li);
        }
        div.appendChild(ul);
        document.querySelector(`.${titleClassName}`).appendChild(div);
    }
    const removeHints = () => {
        document.querySelector(`#${uniqueHintsId}`).remove();
    }

    button.onclick = () => {
        if (document.querySelector(`#${uniqueHintsId}`)) {
            removeHints();
            document.querySelector(`#leetag_hintsbuttontxt`).innerHTML = 'hints';
        } else {
            addHints(hints);
            document.querySelector(`#leetag_hintsbuttontxt`).innerHTML = 'hideH';
        }
    }
    document.querySelector(`.${toolBarClassName}`).appendChild(button);
}

const displayWeeklyContest = (info) => {
    let h5 = document.createElement('h5');
    h5.className = "contestInfo";
    let a = document.createElement('a');
    if (info) {
        a.innerText = `💡from:【 ${info.ContestID_zh}_${info.ProblemIndex} 】`;
        a.href = `${contestURL}${info.ContestSlug}`;
        a.className = 'contestInfoText';
    } else {
        a.innerText = "🙅‍♂️暂未查询到周赛信息";
        a.className = 'contestInfoTextNotFound contestInfoText';
    }
    h5.appendChild(a);
    document.querySelector(`.${titleClassName}`).appendChild(h5);
}

//workflow
const _ = () => {
    getData()
        .then(result => {
            let tmp = handleResult(result[title]);
            if (tmp.isBeta) {
                //TODO:新版
                toolBarClassName = "";
                titleClassName = "";
            }
            return tmp;
        }).then(info => {
            displayWeeklyContest(info.weeklyContest);
            createTagButton(info.question, info.isBeta);
            createHintsButton(info.question, info.isBeta);
        })
}

const createInitButton = (intervalId) => {
    let button = document.createElement("a");
    button.id = "button_init";
    button.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60";
    let buttontxt = document.createElement('span');
    buttontxt.id = "leetag_leetagbuttontxt";
    buttontxt.innerHTML = "leetag";
    button.appendChild(buttontxt);
    button.onclick = () => {
        document.querySelector("#button_init").remove();
        _();
    }

    if (document.querySelector(`.${toolBarClassName}`)) {
        document.querySelector(`.${toolBarClassName}`).appendChild(button);
        clearInterval(intervalId);
    }
}

const main = () => {
    let a = setInterval(() => {
        createInitButton(a);
    }, 500);
}

setTimeout(() => {
    main();
}, 2000);


//fix fetch by fetching again in contentjs
const fetchData = async (title) => {
    let info = {}
    const generateHeader = (title) => {
        //generated by postman.app
        const myHeaders = new Headers();
        myHeaders.append("Connection", "keep-alive");
        myHeaders.append("Origin", "https://leetcode.cn");
        myHeaders.append("User-Agent", "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36");
        myHeaders.append("X-CSRFToken", "hAENke6ObibMXfb2hvOWxPKIDz1Vo1UlEFlH9IWctL5wS7wXBBWSbbhZ2c3YMB1T");
        myHeaders.append("accept", "*/*");
        myHeaders.append("accept-language", "zh-CN");
        myHeaders.append("content-type", "application/json");
        myHeaders.append("sec-ch-ua", "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"");
        myHeaders.append("sec-ch-ua-mobile", "?0");
        myHeaders.append("x-definition-name", "question");
        myHeaders.append("x-operation-name", "questionData");
        myHeaders.append("x-timezone", "Asia/Shanghai");
        myHeaders.append("Access-Control-Allow-Origin", "*");
        myHeaders.append("host", "https://leetcode.cn/");
        const raw = JSON.stringify({ "operationName": "questionData", "variables": { "titleSlug": `${title}` }, "query": "query questionData($titleSlug: String!) {\n  question(titleSlug: $titleSlug) {\n    questionId\n    questionFrontendId\n    categoryTitle\n    boundTopicId\n    title\n    titleSlug\n    content\n    translatedTitle\n    translatedContent\n    isPaidOnly\n    difficulty\n    likes\n    dislikes\n    isLiked\n    similarQuestions\n    contributors {\n      username\n      profileUrl\n      avatarUrl\n      __typename\n    }\n    langToValidPlayground\n    topicTags {\n      name\n      slug\n      translatedName\n      __typename\n    }\n    companyTagStats\n    codeSnippets {\n      lang\n      langSlug\n      code\n      __typename\n    }\n    stats\n    hints\n    solution {\n      id\n      canSeeDetail\n      __typename\n    }\n    status\n    sampleTestCase\n    metaData\n    judgerAvailable\n    judgeType\n    mysqlSchemas\n    enableRunCode\n    envInfo\n    book {\n      id\n      bookName\n      pressName\n      source\n      shortDescription\n      fullDescription\n      bookImgUrl\n      pressImgUrl\n      productUrl\n      __typename\n    }\n    isSubscribed\n    isDailyQuestion\n    dailyRecordStatus\n    editorType\n    ugcQuestionId\n    style\n    exampleTestcases\n    jsonExampleTestcases\n    __typename\n  }\n}\n" });

        return {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };
    }

    const fetchRatingData = async (title) => {
        const result = await fetch("https://zerotrac.github.io/leetcode_problem_rating/data.json", {
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": null,
            "method": "GET",
            "mode": "cors",
            "credentials": "omit"
        }).then(response => response.text())
            .catch(e => console.log(e));
        return JSON.parse(result).find(i => i.TitleSlug === title)
    }

    const fetchTagsAndHints = async (title) => {
        const requestOptions = generateHeader(title)
        // await chrome.cookies.getAll({ url: "https://leetcode.cn/problems/" }, (cookies) => {
        // }) 不拿cookies
        const result = await fetch("https://leetcode.cn/graphql/", { ...requestOptions })
            .then(resp => resp.text())
            .then(res => JSON.parse(res))
            .catch(error => console.log("cannot fetch"))
        return result
    }

    //TODO:是否为新版
    const fetchIsBeta = async () => {
        const result = await fetch("https://leetcode.cn/graphql/noj-go", {
            "headers": {
                "accept": "*/*",
                "accept-language": "zh-CN,zh;q=0.9",
                "content-type": "application/json",
                "random-uuid": "a69f89fa-6e8d-667b-52db-0a9b187e37ba",
                "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
                "sec-ch-ua-mobile": "?0",
                "sec-ch-ua-platform": "\"macOS\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "same-origin",
            },
            "referrer": "https://leetcode.cn/problems/shortest-path-in-binary-matrix/",
            "referrerPolicy": "strict-origin-when-cross-origin",
            "body": "{\"operationName\":\"getBeta\",\"variables\":{},\"query\":\"query getBeta {\\n  userBetaStatusV2(participationType: NEW_QUESTION_DETAIL_PAGE) {\\n    inBeta\\n    hitBeta\\n    __typename\\n  }\\n}\\n\"}",
            "method": "POST",
            "mode": "cors",
            "credentials": "include"
        })
            .then(res => res.text())
            .catch(e => console.log(e))
        return JSON.parse(result);
    }

    const fetchByTitle = async (title) => {
        const leetcodeTagsAndHints = await fetchTagsAndHints(title) //{data:,qustion,}
        const weeklyContest = await fetchRatingData(title); //可以是undefined，表示没有周赛数据
        const isBeta = await fetchIsBeta();
        const tmp = {
            ...info, [title]: {
                leetcodeTagsAndHints,
                weeklyContest,
                isBeta
            }
        }
        return tmp;
    }

    const data = await fetchByTitle(title)
    return { ...info, ...data };
}