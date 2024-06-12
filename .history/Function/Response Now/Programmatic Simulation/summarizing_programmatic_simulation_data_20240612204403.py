import sys
import asyncio
from openai import OpenAI
import nest_asyncio
import json

# Apply the nest_asyncio patch
nest_asyncio.apply()

# OpenAI API client initialization
client = OpenAI(api_key="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")

# Function to get response from GPT-3.5-turbo
async def gpt_get(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(
            model=model,
            messages=messages,
            temperature=0,
        )
    return response.choices[0].message.content.strip(), response.usage.prompt_tokens, response.usage.completion_tokens

# Function to analyze text from URL
async def analyze_text(project_details):
    prompt = f"Provide an example of a recommended project suggestion as a programmatic intervention, encompassing the following elements:\n\n1. Contextualize by selecting a thematic intervention, such as '{', '.join(project_details['themes'])}', and offer insights into the status of {', '.join(project_details['themes'])}-related projects in Egypt, including their quantity, geographic distribution, key donors, implementing partners, and total value according to the EHS database.\n\n2. Evaluate the intervention proposed by the user, who allocates ${project_details['amount']} for {', '.join(project_details['themes'])} projects in the Egyptian Delta over {project_details['timeline']} years, with a {project_details['amountFilter']}% overhead cost. This entails summarizing the key features of the 'Programmatic Simulation' feature they've outlined.\n\n3. Critique the user's decision. While the user aims to address a specific issue, like {project_details['description']}, it's recommended to provide relevant statistics and suggest collaborating with organizations like Gavi for extended medicine or vaccine provision and the African Development Bank (AfDB) for grants on water provision to support sustainable agriculture and animal production. This suggested intervention can be executed within the {project_details['timeline']} year timeframe and {project_details['amount']} budget by collaborating with these partners and implementing specific activities. Alternatively, considering the budget, another impactful {', '.join(project_details['themes'])} intervention could involve {project_details['description']}."

    response, _, _ = await gpt_get(prompt)

    # Placeholder parsing logic
    budget_breakdown = "Placeholder for budget breakdown"
    description = "Placeholder for description"
    analysis_and_recommendations = "Placeholder for analysis and recommendations"
    suggested_intervention = "Placeholder for suggested intervention"

    return {
        'budget_breakdown': budget_breakdown,
        'description': description,
        'analysis_and_recommendations': analysis_and_recommendations,
        'suggested_intervention': suggested_intervention
    }

if __name__ == "__main__":
    try:
        # Receive project details from Node.js
        project_details = json.loads(sys.argv[1])

        # Analyze text using the provided project details
        analysis_results = asyncio.run(analyze_text(project_details))
        print(json.dumps(analysis_results))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)