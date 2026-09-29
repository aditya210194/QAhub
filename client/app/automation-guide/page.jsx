import TutorialPage from '../../src/views/TutorialPage';
import TutorialOutline from '../../src/components/Tutorials/TutorialOutline';
import { tutorialMetadata } from '../../src/lib/tutorialSeo';

export const metadata = tutorialMetadata('automation-guide');

export default function Page() {
    return (
        <>
            <TutorialPage />
            <TutorialOutline slug="automation-guide" />
        </>
    );
}
