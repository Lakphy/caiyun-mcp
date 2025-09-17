import { describe, expect, it } from "vitest";
import { weatherPromptManager } from "../src/prompts/index.js";

describe("WeatherPromptSystem", () => {
  it("should list all available prompts", async () => {
    const prompts = weatherPromptManager.listPrompts();
    
    expect(prompts.length).toBeGreaterThan(0);
    expect(prompts.every(p => p.name && p.description)).toBe(true);
    
    // Check that we have prompts from different categories
    const promptNames = prompts.map(p => p.name);
    expect(promptNames).toContain('meteorology_expert');
    expect(promptNames).toContain('weather_data_analyst');
    expect(promptNames).toContain('realtime_weather_analysis');
  });

  it("should generate static prompt content", async () => {
    const messages = await weatherPromptManager.getPrompt('meteorology_expert', {
      topic: 'temperature',
      level: 'basic'
    });
    
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].role).toBe('user');
    expect(messages[0].content.type).toBe('text');
  });

  it("should generate dynamic prompt content", async () => {
    const mockWeatherData = {
      temperature: 25,
      humidity: 0.6,
      skycon: 'CLOUDY',
      wind: { speed: 5, direction: 90 },
      air_quality: { aqi: { chn: 85 } },
      apparent_temperature: 26,
      cloudrate: 0.7,
      visibility: 10,
      pressure: 101325,
      precipitation: { local: { status: 'ok', intensity: 0 } },
      life_index: {
        ultraviolet: { index: 5, desc: 'moderate' },
        comfort: { index: 3, desc: 'comfortable' }
      }
    };

    const messages = await weatherPromptManager.getPrompt('realtime_weather_analysis', {
      weather_data: JSON.stringify(mockWeatherData),
      location: 'Beijing'
    });
    
    expect(messages).toBeDefined();
    expect(messages.length).toBeGreaterThan(0);
    expect(messages[0].content.text).toContain('Beijing');
    expect(messages[0].content.text).toContain('25');
  });

  it("should get prompt statistics", () => {
    const stats = weatherPromptManager.getPromptStats();
    
    expect(stats.total).toBeGreaterThan(0);
    expect(stats.categories).toBeDefined();
    expect(stats.domains).toBeDefined();
    expect(stats.names.length).toBe(stats.total);
  });

  it("should handle invalid prompt name", async () => {
    await expect(
      weatherPromptManager.getPrompt('invalid_prompt_name')
    ).rejects.toThrow();
  });

  it("should handle invalid dynamic prompt data", async () => {
    await expect(
      weatherPromptManager.getPrompt('realtime_weather_analysis', {
        weather_data: 'invalid json'
      })
    ).rejects.toThrow();
  });
});