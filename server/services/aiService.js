const Anthropic = require('@anthropic-ai/sdk');

class AIService {
  constructor() {
    if (process.env.ANTHROPIC_API_KEY) {
      this.client = new Anthropic({
        apiKey: process.env.ANTHROPIC_API_KEY,
      });
      console.log('[Interview9] Claude AI integration active');
    } else {
      this.client = null;
      console.warn('[Interview9] ANTHROPIC_API_KEY not set — AI features unavailable');
    }
  }

  /**
   * Analyze candidate data: scores, interview performance, vector mapping.
   */
  async analyze(context, data) {
    const systemPrompt = this.buildSystemPrompt(context);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Analyze the following candidate interview data. Return your analysis as JSON with these fields:
- vectorScores: object mapping vector IDs (V1-V9) to { score, subVectors }
- measurement13: { topAttributes: [{ id, name, score }], gapAttributes: [{ id, name, score, recommendation }] }
- recommendations: array of actionable recommendation strings
- redFlags: array of concern strings (empty if none)
- confidence: number 0-1 indicating analysis confidence

Candidate and interview data:
${JSON.stringify(data, null, 2)}`,
        },
      ],
    });

    return response.content[0].text;
  }

  /**
   * Generate an interview plan using Falcone methodology.
   */
  async generate(context, data) {
    const systemPrompt = this.buildSystemPrompt(context);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Generate a structured interview plan using the Falcone methodology. Return JSON with these fields:
- interviewPlan: { stages: string[], estimatedDuration: number (minutes), questionRecommendations: [{ stage, questions: string[], rationale }] }
- focusAreas: array of areas to probe based on role level
- scoringGuidance: object with STAR scoring rubric notes per stage

Role level: ${data.roleLevel}
Focus areas requested: ${JSON.stringify(data.focusAreas || [])}
${data.candidateId ? `Candidate ID: ${data.candidateId}` : ''}`,
        },
      ],
    });

    return response.content[0].text;
  }

  /**
   * Generate hiring recommendation with vector mapping.
   */
  async recommend(context, data) {
    const systemPrompt = this.buildSystemPrompt(context);

    const response = await this.client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: 'user',
          content: `Based on the following candidate data, scores, and interview history, generate a hiring recommendation. Return JSON with these fields:
- hireRecommendation: "proceed" | "hold" | "decline"
- confidence: number 0-1
- reasoning: array of evidence-based reasoning strings
- nextSteps: array of recommended next actions
- vectorAlignment: object mapping relevant vectors to alignment assessment
- riskFactors: array of risk strings (empty if none)

Candidate data:
${JSON.stringify(data, null, 2)}`,
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

RESPONSE FORMAT:
- Always respond with valid JSON only — no markdown, no explanation outside the JSON
- Provide actionable, specific insights tied to the 9 Vectors framework
- Generate prescriptive recommendations, not just observations`;
  }
}

module.exports = new AIService();
