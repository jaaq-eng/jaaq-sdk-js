import { http, HttpResponse } from "msw";
import videos from "@tests/mocks/videos.json";

export const videosHandlers = [
  http.get("http://localhost:3000/videos", () => {
    return HttpResponse.json(videos, { status: 200 });
  }),
];
