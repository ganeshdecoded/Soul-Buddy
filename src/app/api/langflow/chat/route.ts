import { NextResponse } from 'next/server';

if (!process.env.NEXT_PUBLIC_LANGFLOW_API_URL || 
    !process.env.NEXT_PUBLIC_LANGFLOW_FLOW_ID || 
    !process.env.NEXT_PUBLIC_LANGFLOW_ID || 
    !process.env.NEXT_PUBLIC_LANGFLOW_TOKEN) {
  throw new Error('Missing required environment variables for Langflow');
}

const LANGFLOW_URL = process.env.NEXT_PUBLIC_LANGFLOW_API_URL;
const FLOW_ID = process.env.NEXT_PUBLIC_LANGFLOW_FLOW_ID;
const LANGFLOW_ID = process.env.NEXT_PUBLIC_LANGFLOW_ID;
const APPLICATION_TOKEN = process.env.NEXT_PUBLIC_LANGFLOW_TOKEN;

export async function POST(request: Request) {
  try {
    const { message, userId } = await request.json();
    
    const url = `${LANGFLOW_URL}/lf/${LANGFLOW_ID}/api/v1/run/${FLOW_ID}?stream=false`;
    console.log('Making request to:', url);

    const requestBody = {
      input_value: message,
      input_type: "chat",
      output_type: "chat",
      tweaks: {
        "Prompt-ydstl": {
          "template": "You are SoulBuddy, an AI spiritual guide with access to user's spiritual profile and astrological data. \n- Keep responses concise and compassionate\n- Include specific references to user's data when relevant\n- Provide practical, actionable guidance\n- If suggesting rituals or practices, explain their benefits\n- Always maintain a supportive and understanding tone\n\nImportant: If you cannot find specific information in the provided data, acknowledge this and provide general spiritual guidance instead.\n\nRemember: You are a spiritual guide focused on personal growth and well-being. Maintain authenticity while being sensitive to different spiritual beliefs and practices.\n{userId}",
          "userId": userId || ""
        },
        "Agent-c5MrF": {
          "add_current_date_tool": true,
          "agent_description": "A helpful assistant with access to the following tools:",
          "agent_llm": "OpenAI",
          "api_key": process.env.OPENAI_API_KEY,
          "handle_parsing_errors": true,
          "input_value": "",
          "json_mode": false,
          "max_iterations": 15,
          "max_tokens": null,
          "model_kwargs": {},
          "model_name": "gpt-4o-mini",
          "n_messages": 100,
          "openai_api_base": "",
          "order": "Ascending",
          "output_schema": {},
          "seed": 1,
          "sender": "Machine and User",
          "sender_name": "",
          "session_id": "",
          "system_prompt": "You are a helpful assistant that can use tools to answer questions and perform tasks.",
          "temperature": 0.1,
          "template": "{sender_name}: {text}",
          "verbose": true
        },
        "AstraDBToolComponent-0HdPJ": {
          "api_endpoint": process.env.ASTRA_DB_ENDPOINT,
          "collection_name": "horoscope_data",
          "namespace": "default_keyspace",
          "number_of_results": 5,
          "projection_attributes": "*",
          "static_filters": {},
          "token": process.env.ASTRA_DB_TOKEN,
          "tool_description": "providing data for chatbot",
          "tool_name": "chat_data",
          "tool_params": {
            "!userId": userId || "userId",
            "interpretations": "interpretations",
            "recommendations": "recommendations"
          }
        },
        "ChatOutput-4N66A": {
          "background_color": "",
          "chat_icon": "",
          "data_template": "{text}",
          "input_value": "",
          "sender": "Machine",
          "sender_name": "AI",
          "session_id": "",
          "should_store_message": true,
          "text_color": ""
        },
        "ParseData-DPX1N": {
          "sep": "\n",
          "template": userId || "userId"
        },
        "ChatInput-9KO2o": {
          "files": "",
          "background_color": "",
          "chat_icon": "",
          "sender": "User",
          "sender_name": "User",
          "session_id": "",
          "should_store_message": true,
          "text_color": ""
        }
      }
    };

    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${APPLICATION_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestBody)
    });

    const responseText = await response.text();
    console.log('Raw response:', responseText);

    if (!response.ok) {
      console.error('Langflow API Error:', responseText);
      return NextResponse.json(
        { error: responseText },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Error parsing response:', e);
      return NextResponse.json(
        { message: responseText }
      );
    }

    console.log('Parsed response:', JSON.stringify(data, null, 2));

    // Extract message from nested structure
    let message_text = '';
    if (data?.outputs?.[0]?.outputs?.[0]?.outputs?.message?.message?.text) {
      message_text = data.outputs[0].outputs[0].outputs.message.message.text;
    } else {
      message_text = 'I apologize, but I was unable to process your request.';
    }

    return NextResponse.json({ message: message_text });
  } catch (error) {
    console.error('Proxy Error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}