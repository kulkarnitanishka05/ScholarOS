"""
ScholarOS - LLM Module
----------------------
Uses Groq API to generate answers from retrieved context.
"""

import os
from dotenv import load_dotenv
from groq import Groq

load_dotenv()


class LLM:

    def __init__(self):

        self.api_key = os.getenv("GROQ_API_KEY")

        if not self.api_key:
            raise ValueError(
                "GROQ_API_KEY not found in .env file."
            )

        self.model = os.getenv(
            "MODEL_NAME",
            "llama-3.3-70b-versatile"
        )

        self.client = Groq(api_key=self.api_key)

        print(f"[SUCCESS] Connected to Groq ({self.model})")

    def build_prompt(self, context, question):
        """
        Create the prompt sent to the LLM.
        """

        prompt = f"""
You are ScholarOS AI, an intelligent academic research assistant.

Use ONLY the information available in the provided document context.

If the answer cannot be found inside the context, reply exactly:

"I couldn't find the answer in the uploaded documents."

Respond in Markdown whenever appropriate.

---------------------------------------

## Context

{context}

---------------------------------------

## Question

{question}

---------------------------------------

## Answer
"""

        return prompt

    def generate_answer(self, context, question):
        """
        Generate answer using Groq.
        """

        prompt = self.build_prompt(
            context,
            question
        )

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[

                {
                    "role": "system",
                    "content":
                    """
You are ScholarOS AI.

Answer ONLY from the supplied document context.

Use Markdown formatting.

If useful, use:

# Headings

## Subheadings

- Bullet Points

**Bold Text**

Never hallucinate information.
"""
                },

                {
                    "role": "user",
                    "content": prompt
                }

            ],

            temperature=0.2,

            max_tokens=1200

        )

        return response.choices[0].message.content.strip()
    def summarize(self, text):
        """
            Generate a structured AI summary in Markdown.
        """

        prompt = f"""
You are ScholarOS AI, an expert academic research assistant.

Analyze the following document carefully.

Return ONLY valid Markdown.

Use EXACTLY this structure.

# 📄 AI Document Summary

## 📌 Overview

Write a short overview in 3–4 sentences.

---

## 🔑 Key Concepts

List the important concepts using bullet points.

---

## ✅ Important Points

Explain the important learning points.

Use bullet points.

---

## 🧠 Quick Revision Notes

Give short revision notes.

Use bullet points.

---

## 🎯 Conclusion

Write a short conclusion in 2–3 sentences.

Keep the language simple and student friendly.

Document:

{text}
"""

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content":
                    "You generate professional academic summaries in Markdown."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2,

            max_tokens=1200

        )

        return response.choices[0].message.content.strip()

    def compare_documents(self, document1, document2):
        """
        Generate a structured comparison report in Markdown.
        """

        prompt = f"""
You are ScholarOS AI.

Compare the following two documents.

Return ONLY valid Markdown.

Follow EXACTLY this structure.

# 📊 AI Comparison Report

## 📘 Document Overview

Write a short paragraph introducing both documents.

---

## ✅ Similarities

Write bullet points.

---

## ❌ Differences

Create a markdown table.

| Feature | Document 1 | Document 2 |
|---------|------------|------------|
| Main Topic | | |
| Focus | | |
| Examples | | |
| Difficulty | | |
| Practical Use | | |

---

## ⭐ Key Takeaways

Write 5 important bullet points.

---

## 💡 Recommendation

Recommend which document is better for:

- Beginners
- College Exams
- Interview Preparation
- Practical Learning

---

## 🎯 Final Verdict

Write a short conclusion in 2–3 sentences.

Document 1:

{document1}

------------------------------------------------

Document 2:

{document2}
"""

        response = self.client.chat.completions.create(

            model=self.model,

            messages=[
                {
                    "role": "system",
                    "content":
                    "You generate professional comparison reports in Markdown."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],

            temperature=0.2,

            max_tokens=1500

        )

        return response.choices[0].message.content.strip()


if __name__ == "__main__":

    llm = LLM()

    context = """
Artificial Intelligence is the simulation of human intelligence
using computer systems.

Machine Learning is a subset of AI.
"""

    question = "What is Machine Learning?"

    answer = llm.generate_answer(
        context,
        question
    )

    print("\nAnswer:\n")

    print(answer)


