import { useRouter } from 'next/router';

const Oxygen = () => {
    const router = useRouter()

    return (
        <h1>{router.query.districtName}</h1>
    )
}

export default Oxygen;
