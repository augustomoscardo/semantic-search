import { ChromaClient } from "chromadb";
import csv from "csv-parser";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv"
dotenv.config()

const genai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const chromaClient = new ChromaClient();
const collection = await chromaClient.getOrCreateCollection({ name: "movies_gemini" });

const ids = [];
const documents = [];
const metadatas = [];

fs.createReadStream("mpst_full_data.csv")
  .pipe(csv())
  .on('data', (row) => {
    const document = { "title": row["title"], "tags": row["tags"], "synopsis": row["plot_synopsis"] };

    ids.push(row["imdb_id"]);
    documents.push(JSON.stringify(document));
    metadatas.push(document);
  })
  .on('end', async () => {
    let startIdx = 0;

    while (startIdx < 1) {
      let endIdx = startIdx + 1; // ajustar essa quantidade de acordo com o seu hardware, quanto maior o valor, maior o processamento necessário

      console.log(`Embedding documents from ${startIdx} to ${endIdx}`)

      const documentsToEmbed = documents.slice(startIdx, endIdx);

      const response = await genai.models.embedContent({
        model: "models/text-embedding-004",
        contents: documentsToEmbed,
        config: { "task_type": "retrieval_document" }
      });
      console.log(response);
      console.log(response.embeddings.map(e => e.values));



      console.log(`Adding documents from ${startIdx} to ${endIdx}`)

      await collection.add({
        ids: ids.slice(startIdx, endIdx),
        embeddings: response.embeddings.map(e => e.values),
        metadatas: metadatas.slice(startIdx, endIdx),
      });

      startIdx = endIdx;
    }

    console.log("Done!")
  })