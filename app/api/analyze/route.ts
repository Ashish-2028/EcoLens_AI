import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

// Increase payload limit because base64 strings get quite large
// In Next.js App Router this was previously exported in a config object for Pages router
// For App router, we don't need body-parser settings but deploying to platforms like Vercel might have 4.5MB limits.
// We handle standard sizes fine, but we'll add standard timeout logic for good measure.
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '10mb',
        },
    },
};

export const maxDuration = 30; // Extend duration for slow AI calls if deployed

const apiKey = process.env.GEMINI_API_KEY;

console.log("Key exists:", !!apiKey);

if (!apiKey) {
    console.error("GEMINI_API_KEY is not defined in the environment.");
}

const genAI = new GoogleGenerativeAI(apiKey || "");

export async function POST(req: NextRequest) {
    try {
        if (!apiKey) {
            return NextResponse.json({ error: "API key not configured" }, { status: 500 });
        }

        const body = await req.json();
        const { image } = body; // Base64 image string

        if (!image) {
            return NextResponse.json({ error: "No image provided" }, { status: 400 });
        }

        // Initialize the model
        // Using gemini-flash-latest to match the provisioned API key
        const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

        // The prompt enforces a strict JSON response
        const prompt = `
You are EcoLens AI, a high-performance sustainability scanner.
Analyze the provided image of a product. Identify the product and evaluate its environmental impact.
You MUST respond with ONLY a valid JSON object. Do not include markdown formatting like \`\`\`json or any other text before or after the JSON.
The JSON must adhere exactly to the following structure:
{
  "productName": "A concise, specific name for the product found in the image",
  "ecoScore": an integer between 0 and 100 representing how environmentally friendly it is (100 being best),
  "redFlags": [
    {
      "name": "Name of the chemical, material, or harmful ingredient",
      "severity": "high", // Must be exactly 'high', 'medium', or 'low'
      "description": "Short explanation of the negative impact and why it is flagged",
      "category": "E.g., Preservative, Surfactant, Material, Packaging"
    }
  ],
  "greenSwaps": [
    {
      "name": "Name of a more sustainable alternative product",
      "brand": "Suggested brand name for the alternative",
      "score": 95, // integer between 0-100 for the alternative
      "improvement": 45, // integer percentage of improvement over the original
      "tags": ["Biodegradable", "Vegan", "Recyclable"], // Array of 2-3 short tags describing the eco-benefits
      "price": "$12.99" // Estimated price string
    }
  ]
}
If there are no red flags, provide an empty array. If there are no green swaps, provide an empty array.
If you cannot identify a product, provide a generic fallback analysis for a generic consumer good and give it a low score.
    `.trim();

        // Prepare the image part
        // The client should send the base64 string without the data URL prefix (e.g., "data:image/jpeg;base64,")
        // Or we handle cleaning it up here just in case.
        const base64Data = image.replace(/^data:image\/(png|jpeg|webp|heic|heif);base64,/, "");

        const imageParts = [
            {
                inlineData: {
                    data: base64Data,
                    // Use a generic mime type if we stripped the prefix, or assume jpeg/png
                    // For Gemini API, image/jpeg, image/png, image/webp, image/heic, image/heif are supported
                    mimeType: "image/jpeg"
                },
            },
        ];

        const result = await model.generateContent([prompt, ...imageParts]);
        const response = await result.response;
        let text = response.text();

        // Clean up potential markdown formatting from Gemini's response
        text = text.replace(/```(?:json)?/gi, "").trim();

        let jsonResponse;
        try {
            jsonResponse = JSON.parse(text);
        } catch (parseError) {
            console.error("Failed to parse Gemini response as JSON:", text);
            return NextResponse.json({ error: "Invalid response format from AI" }, { status: 500 });
        }

        // Optional: Validate the JSON structure loosely
        if (!jsonResponse || typeof jsonResponse !== 'object') {
            return NextResponse.json({ error: "Malformed JSON response from AI" }, { status: 500 });
        }

        // Ensure defaults if missing
        const safeResponse = {
            productName: jsonResponse.productName || "Unknown Product",
            ecoScore: typeof jsonResponse.ecoScore === 'number' ? jsonResponse.ecoScore : 50,
            redFlags: Array.isArray(jsonResponse.redFlags) ? jsonResponse.redFlags : [],
            greenSwaps: Array.isArray(jsonResponse.greenSwaps) ? jsonResponse.greenSwaps : [],
        };

        return NextResponse.json(safeResponse);

    } catch (error) {
        console.error("Error in /api/analyze:", error);
        return NextResponse.json({ error: "Failed to analyze image" }, { status: 500 });
    }
}
