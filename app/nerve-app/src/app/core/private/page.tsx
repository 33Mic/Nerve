import { logout } from "../../logout/actions";
import { createClient } from '@/utils/supabase/server';
import { Button } from '@/components/ui/button';

export default async function PrivatePage() {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()

    return (
        <div>
            <p>Hello {data.user?.email}</p>
            <Button className='font-bold' onClick={logout}>Log Out</Button>
        </div>
    );
}