import { NextRequest, NextResponse } from "next/server";
// Next.js 백엔드 프록시
// 기존방식 요청 : http://127.0.0.1:8000/menus
// 변경후 방식 요청 : /api/menus
// 방식의 장점은 다음과 같습니다.
// 백엔드 주소를 브라우저 코드에서 숨길 수 있습니다.
// 프론트엔드와 백엔드 사이의 CORS 문제를 줄일 수 있습니다.
// 백엔드 주소가 바뀌어도 환경변수만 변경하면 됩니다.
// 프론트엔드의 API 호출 주소가 통일됩니다.

const BACKEND_URL = process.env.BACKEND_API_URL;

async function proxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  if (!BACKEND_URL) {
    return NextResponse.json(
      { detail: "BACKEND_API_URL 설정이 없습니다." },
      { status: 500 }
    );
  }

  try {
    const { path } = await context.params;

    const backendUrl = new URL(
      `/${path.map(encodeURIComponent).join("/")}`,
      BACKEND_URL
    );

    backendUrl.search = request.nextUrl.search;

    const body =
      request.method === "GET" || request.method === "HEAD"
        ? undefined
        : await request.arrayBuffer();

    const response = await fetch(backendUrl, {
      method: request.method,
      headers: {
        "Content-Type":
          request.headers.get("content-type") || "application/json"
      },
      body,
      cache: "no-store"
    });

    const responseBody = await response.arrayBuffer();

    return new Response(responseBody, {
      status: response.status,
      headers: {
        "Content-Type":
          response.headers.get("content-type") ||
          "application/json"
      }
    });
  } catch (error) {
    console.error("Backend proxy error:", error);

    return NextResponse.json(
      { detail: "백엔드 서버에 연결할 수 없습니다." },
      { status: 502 }
    );
  }
}

export {
  proxyRequest as GET,
  proxyRequest as POST,
  proxyRequest as PUT,
  proxyRequest as DELETE,
  proxyRequest as PATCH
};