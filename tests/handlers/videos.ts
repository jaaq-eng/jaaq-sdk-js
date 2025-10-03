import { http, HttpResponse } from "msw";
import videos from "@tests/mocks/videos.json";

export const videosHandlers = [
  http.get("http://localhost:3000/b2b/videos/:id", ({ params }) => {
    const { id } = params as { id: string };
    if (id === videos.video.id) {
      return HttpResponse.json(videos.video, { status: 200 });
    }
    return HttpResponse.json({ message: "Not Found" }, { status: 404 });
  }),
];
