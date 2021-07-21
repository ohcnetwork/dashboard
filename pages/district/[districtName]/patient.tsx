import { useRouter } from 'next/router';

const Patient = () => {
    const router = useRouter()

    return (
        <h1>{router.query.districtName}</h1>
    )
}

export default Patient;
