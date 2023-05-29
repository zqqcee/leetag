const baseURL = "https://leetcode.cn/problems/"
const contestURL = "https://leetcode.cn/contest/weekly-contest-192"
const url = window.location.href;
const title = url.replace(baseURL, "").replace("/", "");
const uniqueId = "asdlfkjasdlkfjasdlkfj" //判断tags按钮是否存在

let toolBarClassName = "css-1e1vffy-Tools"
let titleClassName = "css-10c1h40-Title"



const handleResult = (data) => {
    let info = {}
    info.isBeta = data.isBeta.data.userBetaStatusV2.inBeta
    info.question = data.leetcodeTagsAndHints.data.question;
    info.weeklyContest = data.weeklyContest
    return info
}


const getData = async () => {
    try {
        const result = await chrome.runtime.sendMessage({ action: "getData", title })
        return result;
    } catch (e) {
        console.error("please refresh the extension and website, try again.");
    }
}


/**
 * 创建tags按钮
 */
const createTagButton = (info) => {
    const addTag = (info) => {
        const { topicTags } = info;
        const div = document.createElement('div')
        div.id = uniqueId
        const tag = topicTags.forEach(tag => {
            const a = document.createElement('a')
            a.href = `/tag/${tag.slug}`
            a.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60"
            const txt = document.createElement('span')
            txt.innerHTML = `${tag.translatedName}`
            a.appendChild(txt)
            div.appendChild(a)
            div.className = "test"
        })
        document.querySelector(`.${titleClassName}`).appendChild(div)
    }
    const removeTag = () => {
        document.querySelector(`#${uniqueId}`).remove()
    }
    let button = document.createElement("a")
    // button.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60"
    button.className = "button"
    let buttontxt = document.createElement('span')
    buttontxt.id = "leetag_tagsbuttontxt"
    buttontxt.innerHTML = "tags"

    button.appendChild(buttontxt)

    button.onclick = () => {
        if (document.querySelector(`#${uniqueId}`)) {
            removeTag()
            document.querySelector("#leetag_tagsbuttontxt").innerHTML = "tags"
        } else {
            addTag(info)
            document.querySelector("#leetag_tagsbuttontxt").innerHTML = "hide"
        }
    }

    document.querySelector(`.${toolBarClassName}`).appendChild(button)
}

const createHintsButton = (info) => {
    const { hints } = info
    let button = document.createElement("a")
    button.className = "button"
    let buttontxt = document.createElement('span')
    buttontxt.id = "leetag_hintsbuttontxt"
    buttontxt.innerHTML = "hints"
    button.appendChild(buttontxt)
    button.onclick = () => {
        if (hints.length !== 0) {
            alert(hints) //TODO：使用更好的展示方式
        } else {
            alert("no hints T.T")
        }
    }
    document.querySelector(`.${toolBarClassName}`).appendChild(button)
}

const displayWeeklyContest = (info) => {
    let h5 = document.createElement('h5');
    h5.className = "contestInfo"
    let a = document.createElement('a')

    if (info) {
        a.innerText = `💡from:【 ${info.ContestID_zh}_${info.ProblemIndex} 】`
        a.href = `${contestURL}${info.ContestSlug}`
    } else {
        a.innerText = "🙅‍♂️暂未查询到周赛信息"
    }
    h5.appendChild(a);
    document.querySelector(`.${titleClassName}`).appendChild(h5)
}

//workflow
const _ = () => {
    getData()
        .then(result => {
            let tmp = handleResult(result[title]);
            if (tmp.isBeta) {
                //TODO:新版
                toolBarClassName = ""
                titleClassName = ""
            }
            return tmp;
        }).then(info=>{
            displayWeeklyContest(info.weeklyContest)
            createTagButton(info.question, info.isBeta)
            createHintsButton(info.question, info.isBeta)
        })

        

}

const createInitButton = (intervalId) => {
    let button = document.createElement("a")
    button.id = "button_init"
    button.className = "topic-tag__1z4- css-1np0stn-BasicTag e4dtce60"
    let buttontxt = document.createElement('span')
    buttontxt.id = "leetag_leetagbuttontxt"
    buttontxt.innerHTML = "leetag"
    button.appendChild(buttontxt)
    button.onclick = () => {
        document.querySelector("#button_init").remove()
        _()
    }

    if (document.querySelector(`.${toolBarClassName}`)) {
        document.querySelector(`.${toolBarClassName}`).appendChild(button)
        clearInterval(intervalId)
    }
}



const main = () => {
    let a = setInterval(() => {
        createInitButton(a)
    }, 500);
}


setTimeout(() => {
    main()
}, 2000);


// (async () => {
//     const response = await chrome.runtime.sendMessage({ greeting: "hello" });
    
//     console.log(response);
// })();

