import { UserButton } from "@components/user-button";
import { signOut } from "@server/auth";

export default async function Page() {
  return (
    <>
      <form
        action={async () => {
          "use server";
          await signOut();
        }}
      >
        <button type="submit">Sign out</button>
      </form>
      <UserButton />
    </>
  );
}
