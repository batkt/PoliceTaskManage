import { TOKEN_KEY } from "@/lib/config";
import { getLoggedUser } from "@/ssr/service/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    // Get token from Authorization header or cookies
    const authHeader = req.headers.get('Authorization');
    let token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : undefined;
    
    if (!token) {
        token = req.cookies.get(TOKEN_KEY)?.value;
    }

    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const res = await getLoggedUser(token);

    if (!res) {
        return NextResponse.json({ error: 'Unauthorized', message: 'Invalid token' }, { status: 401 });
    }

    return NextResponse.json({
        isOk: true,
        data: {
            user: res,
            accessToken: token,
        },
    });
}