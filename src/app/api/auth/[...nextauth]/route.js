import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";

const handler = NextAuth({
  site: process.env.NEXTAUTH_URL || "http://localhost:3000",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        // Add your own authentication logic here
        if (
          credentials.username === "admin" &&
          credentials.password === "admin123"
        ) {
          // Return user object if credentials are valid
          return Promise.resolve({
            id: 1,
            name: "Admin",
            email: "admin@example.com",
          });
        } else {
          // Return null if credentials are invalid
          return Promise.resolve(null);
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ account, profile }) {
      // Chỉ thực hiện cuộc gọi API cho các nhà cung cấp OAuth
      if (
        account &&
        (account.provider === "google" || account.provider === "github")
      ) {
        try {
          // Logic gọi API cho social login vẫn giữ nguyên
          const res = await fetch("https://cinema-minio.onrender.com/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ idToken: account.id_token }),
          });

          if (res.ok) {
            console.log("Đăng nhập thành công");
            return true;
          }
          // Nếu API trả về lỗi, từ chối đăng nhập
          return false;
        } catch (error) {
          console.error("Lỗi khi gọi API đăng nhập:", error);
          // Xảy ra lỗi mạng hoặc lỗi khác, từ chối đăng nhập
          return false;
        }
      }
      // Cho phép đăng nhập với các nhà cung cấp khác (ví dụ: credentials)
      return true;
    },
  },
});
export { handler as GET, handler as POST };
