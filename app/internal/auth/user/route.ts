import { TOKEN_KEY } from "@/lib/config";
import { getLoggedUser } from "@/ssr/service/user";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest) => {
    // Get token from cookies
    const token = req.cookies.get(TOKEN_KEY)?.value;
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const res = await getLoggedUser(token);

    return NextResponse.json({
        isOk: true,
        data: {
            user: res,
            accessToken: token,
        },
    });
}