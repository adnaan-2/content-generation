import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { prompt, type } = await request.json();

    if (!prompt || !type) {
      return NextResponse.json(
        { error: 'Prompt and type are required' },
        { status: 400 }
      );
    }

    if (type === 'photo') {
      // Using free image generation services
      // Pollinations.ai is a free service that doesn't require API keys
      try {
        // Pollinations.ai free image generation
        const pollinationsUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&nologo=true`;
        
        const response = await fetch(pollinationsUrl, {
          method: 'GET',
          headers: {
            'Accept': 'image/*',
          },
        });

        if (response.ok) {
          const contentType = response.headers.get('content-type') || '';
          
          if (contentType.includes('image/')) {
            const imageBuffer = await response.arrayBuffer();
            const base64 = Buffer.from(imageBuffer).toString('base64');
            
            return NextResponse.json({
              image: `data:image/png;base64,${base64}`,
              type: 'photo',
            });
          } else {
            throw new Error('Unexpected response format from image service');
          }
        } else {
          throw new Error(`Image generation failed: ${response.status} ${response.statusText}`);
        }
      } catch (error: any) {
        // Fallback: Try alternative free service or return error
        console.error('Image generation error:', error);
        throw new Error(
          error.message || 
          'Image generation service is currently unavailable. Please try again in a few moments.'
        );
      }
    } else if (type === 'video') {
      // Free video generation APIs are very limited
      // Try multiple approaches and services
      // Note: Most free video generation services require API keys or have limited availability
      const videoModels = [
        {
          url: 'https://router.huggingface.co/models/cerspense/zeroscope-v2-xl',
          body: { inputs: prompt }
        },
        {
          url: 'https://router.huggingface.co/models/anotherjesse/zeroscope-v2-xl',
          body: { inputs: prompt }
        },
        {
          url: 'https://router.huggingface.co/models/strrl/zeroscope-v2-xl-576w',
          body: { inputs: prompt }
        },
      ];

      let lastError: any = null;

      for (const model of videoModels) {
        try {
          const response = await fetch(model.url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(model.body),
          });

          if (response.ok) {
            const contentType = response.headers.get('content-type') || '';
            
            // Check if it's a video or JSON error
            if (contentType.includes('application/json')) {
              const errorData = await response.json();
              if (errorData.error?.includes('loading') || errorData.estimated_time) {
                lastError = new Error(`Model is loading. Please try again in ${Math.ceil(errorData.estimated_time || 60)} seconds.`);
                continue;
              }
              lastError = new Error(errorData.error || 'Model returned an error');
              continue;
            }

            // Try to get video
            try {
              const videoBuffer = await response.arrayBuffer();
              const bytes = new Uint8Array(videoBuffer);
              
              // Check if it's actually a video (MP4 starts with specific bytes)
              const isVideo = bytes.length > 0 && (
                (bytes[0] === 0x00 && bytes[1] === 0x00 && bytes[2] === 0x00 && bytes[3] === 0x18 && bytes[4] === 0x66 && bytes[5] === 0x74 && bytes[6] === 0x79 && bytes[7] === 0x70) || // MP4
                (bytes[0] === 0x1A && bytes[1] === 0x45 && bytes[2] === 0xDF && bytes[3] === 0xA3) || // WebM
                contentType.includes('video/')
              );

              if (isVideo || contentType.includes('video/') || contentType.includes('application/octet-stream')) {
                const base64 = Buffer.from(videoBuffer).toString('base64');
                return NextResponse.json({
                  video: `data:video/mp4;base64,${base64}`,
                  type: 'video',
                });
              } else {
                // Might be JSON error
                const text = new TextDecoder().decode(videoBuffer);
                try {
                  const errorData = JSON.parse(text);
                  if (errorData.error?.includes('loading') || errorData.estimated_time) {
                    lastError = new Error(`Model is loading. Please try again in ${Math.ceil(errorData.estimated_time || 60)} seconds.`);
                    continue;
                  }
                  lastError = new Error(errorData.error || 'Model returned an error');
                } catch {
                  lastError = new Error('Unexpected response format');
                }
                continue;
              }
            } catch (err: any) {
              lastError = err;
              continue;
            }
          } else {
            // Non-200 status
            let errorData: any = null;
            try {
              const text = await response.text();
              if (text) {
                errorData = JSON.parse(text);
              }
            } catch {
              // Not JSON
            }

            if (errorData?.error?.includes('loading') || errorData?.estimated_time) {
              lastError = new Error(`Model is loading. Please try again in ${Math.ceil(errorData.estimated_time || 60)} seconds.`);
              continue;
            }
            
            if (errorData?.error) {
              lastError = new Error(errorData.error);
            } else {
              lastError = new Error(`HTTP ${response.status}: ${response.statusText || 'Request failed'}`);
            }
            continue;
          }
        } catch (err: any) {
          lastError = err;
          continue;
        }
      }

      // All models failed - return helpful error message
      return NextResponse.json({
        error: lastError?.message || 'Video generation services are currently unavailable. Free video generation APIs are very limited. Please try image generation instead, or wait a few moments and try again.',
        type: 'video',
      }, { status: 503 });
    }

    return NextResponse.json(
      { error: 'Invalid type. Use "photo" or "video"' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Generation error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate media' },
      { status: 500 }
    );
  }
}
