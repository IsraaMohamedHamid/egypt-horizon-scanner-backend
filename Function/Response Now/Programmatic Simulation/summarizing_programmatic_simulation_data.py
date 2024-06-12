import sys
import asyncio
import nest_asyncio
import json
from openai import OpenAI

# Apply the nest_asyncio patch
nest_asyncio.apply()

# OpenAI API client initialization
client = OpenAI(api_key="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")

# Function to get response from GPT-3.5-turbo
async def gpt_get(prompt, model="gpt-3.5-turbo"):
    messages = [{"role": "user", "content": prompt}]
    response = await client.chat_completions.create(
        model=model,
        messages=messages,
        temperature=0,
    )
    return response.choices[0].message.content.strip(), response.usage.prompt_tokens, response.usage.completion_tokens

# Function to analyze text from project details
async def analyze_text(project_details):
    try:
        themes = ', '.join(project_details['themes'])
        prompt = (
            f"Provide an example of a recommended project suggestion as a programmatic intervention, encompassing the following elements:\n\n"
            f"1. Contextualize by selecting a thematic intervention, such as '{themes}', and offer insights into the status of {themes}-related projects in Egypt, "
            f"including their quantity, geographic distribution, key donors, implementing partners, and total value according to the EHS database.\n\n"
            f"2. Evaluate the intervention proposed by the user, who allocates {project_details['timeline']} year timeframe and {project_details['amountFilter']} {project_details['minAmount']} and {project_details['maxAmount']} or {project_details['amount']} for {themes} projects in the Egyptian Delta over "
            f"{project_details['timeline']} years, with a {project_details['overheadCost']}% overhead cost. This entails summarizing the key features of the 'Programmatic Simulation' feature they've outlined.\n\n"
            f"3. Critique the user's decision. While the user aims to address a specific issue, like {project_details['summary']}, it's recommended to provide relevant statistics and suggest collaborating with organizations like Gavi for extended medicine or vaccine provision and the African Development Bank (AfDB) for grants on water provision to support sustainable agriculture and animal production. "
            f"This suggested intervention can be executed within the {project_details['timeline']} year timeframe and {project_details['amountFilter']} {project_details['minAmount']} and {project_details['maxAmount']} or {project_details['amount']} budget by collaborating with these partners and implementing specific activities. Alternatively, considering the budget, another impactful {themes} intervention could involve {project_details['summary']}."
        )

        response, _, _ = await gpt_get(prompt)
        
        # Placeholder parsing logic
        budget_breakdown = "Placeholder for budget breakdown"
        summary = "Placeholder for summary"
        analysis_and_recommendations = "Placeholder for analysis and recommendations"
        suggested_intervention = "Placeholder for suggested intervention"

        return {
            'budget_breakdown': budget_breakdown,
            'summary': summary,
            'analysis_and_recommendations': analysis_and_recommendations,
            'suggested_intervention': suggested_intervention
        }
    except Exception as e:
        print(f"Error analyzing text: {e}")
        raise

if __name__ == "__main__":
    try:
        # Receive project details from Node.js
        if len(sys.argv) < 2:
            raise ValueError("No project details provided")

        project_details = json.loads(sys.argv[1])

        # Analyze text using the provided project details
        analysis_results = asyncio.run(analyze_text(project_details))
        print(json.dumps(analysis_results))
    except Exception as e:
        print(json.dumps({'error': str(e)}))
        sys.exit(1)
