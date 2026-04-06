const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
    }
  }

  async analyze(context, data) {
    if (!this.client) {
      return this.mockAnalysis(context, data);
    }

    const systemPrompt = this.buildSystemPrompt(context);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the following interview data and provide insights:\n\n${JSON.stringify(data, null, 2)}`,
        },
      ],
    });

    return response.content[0].text;
  }

  buildSystemPrompt(context) {
    return `You are the Interview Intelligence Agent for Interview9.ai, part of TheGreyMatter.ai platform.

FRAMEWORK CONTEXT:
- 9 Vectors: Market, People, Finance, Strategy, Operations, Execution, Expectations, Governance, Entity
- 37 Sub-Vectors with 242+ diagnostic themes
- Measurement13: 13 leadership attributes (Competence, Character, Chemistry)
- STAR Framework: Situation, Task, Action, Result
- Falcone Methodology: 96 structured behavioral interview questions

CURRENT CONTEXT:
- Organization: ${context.orgName || 'TheGreyMatter.ai'}
- User Role: ${context.userRole || 'Interviewer'}
- Application: Interview9.ai

EVALUATION RULES:
- Weight pressure-cooker question responses 1.5x for Measurement13 attributes #7 (Adaptability), #8 (Emotional Intelligence), #9 (Integrity)
- Flag "rebel producer" pattern: high V6 Performance + low V2 Culture scores
- Reference triangulation: weight reference data 0.7x vs self-report 0.3x when discrepancies exist
- All theme references must use canonical 9Vectors themes only

Provide actionable, specific insights tied to the 9 Vectors framework. Generate prescriptive recommendations, not just observations.`;
  }

  mockAnalysis(context, data) {
    return JSON.stringify({
      analysis: 'Mock analysis — configure ANTHROPIC_API_KEY for live Claude integration',
      recommendations: ['Configure API key for full AI analysis capabilities'],
    });
  }
}

module.exports = new AIService();
