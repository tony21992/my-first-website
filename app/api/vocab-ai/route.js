import openai from "@/services/openai";
import db from "@/services/db";

export async function Get() {
    const docList = await db.collection("vocab-ai").orderBy("createdAt","desc").get();
    const vocabList = [];
    docList.forEach(doc => {
        const result = doc.data();
        vocabList.push(result);
    })
    return Response.json(vocabList);
}

export async function POST(req) {
    const body = await req.json();
    console.log("body:", body);
    const { userInput, language} = body;
    
    // TODO: 透過gpt-4o-mini模型讓AI回傳相關單字
    // 文件連結：https://platform.openai.com/docs/guides/text-generation/chat-completions-api?lang=node.js
    // JSON Mode: https://platform.openai.com/docs/guides/text-generation/json-mode?lang=node.js
    const systemPrompt = `請作為一個單字聯想AI根據所提供的單字聯想5個相關單字並提供繁體中文的翻譯
    例如:
    單字: 水果
    語言: 英文
    回應 JSON 範例:
    {
        wordList: [Apple, Banana, ...],
        zhWordList: [蘋果, 香蕉, ...]}`;
    const propmpt = `單字 ${userInput} 語言: ${language}`;

    const openAIReqBody = {
        messages: [
            { "role": "system", "content": systemPrompt },
            { "role": "user", "content": propmpt }
        ],
        model: "gpt-4o-mini",
        response_format: {type: "json_object"},
    };
    const completion = await openai.chat.completions.create(openAIReqBody);
    
    const payload = JSON.parse(completion.choices[0].message.content);
    // console.log("payload:", payload);
    
    const result = {
        title: userInput,
        payload,
        language,
        createdAt: new Date().getTime(),
    }

const firestoreRes = await db.collection("vocab-ai").add(result);

    return Response.json(result);
}