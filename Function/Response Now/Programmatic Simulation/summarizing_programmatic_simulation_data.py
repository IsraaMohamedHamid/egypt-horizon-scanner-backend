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
async def gpt_get(prompt, model="gpt-4o-mini"): # gpt-3.5-turbo
    messages = [{"role": "user", "content": prompt}]
    response = client.chat.completions.create(
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
            f"Provide an in-depth example of a recommended project suggestion as a programmatic intervention, encompassing the following elements:\n\n"
            f"### 1. Contextualization ###\n"
            f"Select a thematic intervention, such as '{themes}', and offer comprehensive insights into the status of {themes}-related projects in Egypt. Include details on their quantity, geographic distribution, key donors, implementing partners, and total value according to the EHS database.\n\n"
            f"### 2. Evaluation of the Proposed Intervention ###\n"
            f"Evaluate the intervention proposed by the user, who allocates a {project_details['timeline']} year timeframe and a budget range of {project_details['amountFilter']} between {project_details['minAmount']} and {project_details['maxAmount']} or a fixed amount of {project_details['amount']} for {themes} projects in the Egyptian Delta. Summarize the key features of the 'Programmatic Simulation' they've outlined, and explain how the budget will be distributed over the {project_details['timeline']} weeks.\n\n"
            f"### 3. Critique and Recommendations ###\n"
            f"While the user's goal of addressing {project_details['description']} is commendable, provide relevant statistics and suggest collaborating with organizations such as Gavi for extended medicine or vaccine provision, and the African Development Bank (AfDB) for grants on water provision to support sustainable agriculture and animal production. Explain how this intervention can be executed within the {project_details['timeline']} year timeframe and budget range. Additionally, propose alternative impactful interventions in the {themes} area that align with the budget and timeframe, highlighting potential partnerships and activities.\n\n"
            f"### 4. Budget Breakdown ###\n"
            f"Provide a detailed budget breakdown, explaining how the allocated funds will be distributed across different activities and overheads to maximize impact.\n\n"
            f"### 5. Summary ###\n"
            f"Summarize the intervention, including its goals, expected outcomes, and how it aligns with national and international initiatives.\n\n"
            f"### 6. Analysis and Recommendations ###\n"
            f"Offer an in-depth, extensive analysis of the proposed intervention's strengths and weaknesses, and recommend specific actions or modifications to enhance its effectiveness and sustainability.\n\n"
            f"### 7. Suggested Intervention ###\n"
            f"Propose a concrete intervention that leverages the strengths of the user's proposal while addressing any identified gaps or weaknesses. Include details on implementation strategies, potential partners, and expected outcomes.\n\n"
            f"Provide the answer in a structured format with the following JSON keys: "
            f"'contextualization', 'evaluation_of_proposed_intervention', 'critique_and_recommendations', 'budget_breakdown', 'summary', 'analysis_and_recommendations', and 'suggested_intervention', all with type string."
        )


        response, _, _ = await gpt_get(prompt)

        # Assuming the response is already in structured format
        structured_response = json.loads(response)


        # Add the provided data to the structured response
        structured_response['themes'] = project_details['themes']
        structured_response['municipalDivisions'] = project_details['municipalDivisions']
        structured_response['governorates'] = project_details['governorates']
        structured_response['minAmount'] = project_details['minAmount']
        structured_response['maxAmount'] = project_details['maxAmount']
        structured_response['amount'] = project_details['amount']
        structured_response['timeline'] = project_details['timeline']
        structured_response['description'] = project_details['description']
        structured_response['amountFilter'] = project_details['amountFilter']

        return structured_response
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
