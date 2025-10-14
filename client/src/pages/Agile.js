import React, { useState } from "react";
import { Accordion, Card, Button } from "react-bootstrap";
import "./agile.css";

const AgileTesting = () => {
    const [activeTutorial, setActiveTutorial] = useState(null);

    // Sample content for the Agile Testing tutorials (You can replace this with your actual content)
    const contentData = {
        "Agile Testing Overview": {
            "Introduction to Agile Testing": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fbfc', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Introduction to Agile Methodologies</h1>

                    {/* Section: What are Agile Methodologies? */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What are Agile Methodologies?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile Methodologies are a collection of software development and project management
                            approaches that prioritize flexibility, teamwork, and delivering value to the customer.
                            Introduced in response to the limitations of traditional models like Waterfall, Agile
                            embraces iterative development, continuous feedback, and the ability to adapt to change
                            swiftly.
                        </p>
                    </section>

                    {/* Section: Why Agile Methodologies? */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Why Agile Methodologies?</h2>
                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'space-around',
                            gap: '30px',
                            marginTop: '20px'
                        }}>
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <h3 style={{color: '#2c3e50'}}>Overcoming Inflexibility</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Agile addresses the rigidity of traditional models by enabling teams to pivot as
                                    requirements evolve. It eliminates the "set-in-stone" mindset, fostering
                                    adaptability to market trends and customer needs.
                                </p>
                            </div>
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <h3 style={{color: '#2c3e50'}}>Faster Feedback Loops</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    With Agile, customers and stakeholders can see working increments early and often.
                                    This frequent feedback reduces misalignment and ensures that the final product meets
                                    expectations.
                                </p>
                            </div>
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <h3 style={{color: '#2c3e50'}}>Continuous Delivery</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Instead of waiting months for a finished product, Agile teams deliver functional
                                    components regularly, allowing for continuous value delivery and early risk
                                    mitigation.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Core Values */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Core Values of Agile</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '800px',
                            margin: '0 auto',
                            marginTop: '30px',
                            color: '#7f8c8d'
                        }}>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Individuals and Interactions</h3>
                                <p>
                                    Agile emphasizes the importance of communication and collaboration between team
                                    members over reliance on rigid processes or tools.
                                </p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Working Software</h3>
                                <p>
                                    Delivering functional software takes precedence over exhaustive documentation,
                                    ensuring tangible progress and customer satisfaction.
                                </p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Customer Collaboration</h3>
                                <p>
                                    Agile encourages active engagement with customers to ensure their evolving needs are
                                    consistently addressed.
                                </p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Responding to Change</h3>
                                <p>
                                    Instead of following a fixed plan, Agile embraces change as an opportunity to
                                    enhance the final product.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Key Practices */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Practices of Agile</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Iterative Development:</strong> Break work into smaller cycles called sprints
                                (1–4 weeks).
                            </li>
                            <li><strong>Incremental Delivery:</strong> Deliver small, functional increments of the
                                product.
                            </li>
                            <li><strong>Continuous Feedback:</strong> Engage stakeholders and customers frequently for
                                feedback.
                            </li>
                            <li><strong>Collaborative Teams:</strong> Cross-functional teams work together to deliver
                                complete features.
                            </li>
                            <li><strong>Retrospectives:</strong> Teams reflect on what went well and what can improve
                                after every iteration.
                            </li>
                        </ul>
                    </section>

                    {/* Section: When to Use Agile */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>When to Use Agile?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile is especially effective in projects with:
                        </p>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '20px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Rapidly changing requirements or undefined goals.</li>
                            <li>High customer involvement and demand for quick feedback.</li>
                            <li>Innovation or experimentation, requiring trial and error.</li>
                            <li>Small to medium-sized teams with a need for collaboration.</li>
                        </ul>
                    </section>

                    {/* Section: Impact of Agile */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Impact of Agile on Software Development</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '800px',
                            margin: '30px auto',
                            color: '#7f8c8d'
                        }}>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Faster Time-to-Market</h3>
                                <p>Delivering smaller increments ensures quicker releases and customer value.</p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Risk Reduction</h3>
                                <p>Incremental delivery identifies potential risks earlier in the development cycle.</p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Improved Collaboration</h3>
                                <p>Agile fosters a culture of teamwork and communication across stakeholders.</p>
                            </div>
                            <div>
                                <h3 style={{color: '#2c3e50'}}>Customer Satisfaction</h3>
                                <p>Regularly incorporating feedback ensures the product aligns with customer needs.</p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile methodologies have reshaped modern software development by enabling teams to respond
                            swiftly to change, deliver value incrementally, and foster collaboration. Whether in dynamic
                            environments or customer-focused projects, Agile continues to be a cornerstone of innovation
                            and quality in software development.
                        </p>
                    </section>
                </div>

            ),
            "Agile Testing Principles": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fbfc', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Agile Testing Principles</h1>

                    {/* Section: Introduction */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Introduction</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile Testing is an integral part of Agile software development, ensuring quality and
                            functionality in fast-paced, iterative environments. Guided by core principles, Agile
                            Testing aligns testing efforts with Agile values, promoting collaboration, adaptability, and
                            continuous feedback.
                        </p>
                    </section>

                    {/* Section: Principles */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Core Principles of Agile Testing</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '1000px',
                            margin: '30px auto',
                            color: '#7f8c8d'
                        }}>
                            {/* Principle 1 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>1. Testing is Continuous</h3>
                                <p>
                                    In Agile, testing happens throughout the development cycle, not just at the end.
                                    This ensures issues are identified and addressed early, reducing the cost and impact
                                    of defects.
                                </p>
                                <p>
                                    <strong>Example:</strong> During a sprint, testers work alongside developers to
                                    validate features as they are built, using automation and exploratory testing to
                                    ensure functionality and usability.
                                </p>
                            </div>

                            {/* Principle 2 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>2. Everyone Owns Quality</h3>
                                <p>
                                    Agile emphasizes that quality is a shared responsibility. Developers, testers, and
                                    product owners collaborate to define and meet quality standards.
                                </p>
                                <p>
                                    <strong>Example:</strong> Pair programming sessions between developers and testers
                                    can help identify potential issues during code creation.
                                </p>
                            </div>

                            {/* Principle 3 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>3. Test Early and Often</h3>
                                <p>
                                    Testing begins as soon as development starts, with frequent validations to catch
                                    defects quickly. Agile uses techniques like test-driven development (TDD) and
                                    behavior-driven development (BDD) to integrate testing into coding.
                                </p>
                                <p>
                                    <strong>Example:</strong> Writing unit tests before code implementation ensures each
                                    module works as intended.
                                </p>
                            </div>

                            {/* Principle 4 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>4. Short Feedback Loops</h3>
                                <p>
                                    Agile promotes rapid feedback from stakeholders, customers, and testing. Regular
                                    feedback loops ensure the product evolves in line with user expectations.
                                </p>
                                <p>
                                    <strong>Example:</strong> Demo sessions at the end of each sprint allow stakeholders
                                    to review features and provide feedback immediately.
                                </p>
                            </div>

                            {/* Principle 5 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>5. Automate When Possible</h3>
                                <p>
                                    Automation enhances efficiency by handling repetitive tasks, such as regression
                                    testing, and allows testers to focus on complex, exploratory scenarios.
                                </p>
                                <p>
                                    <strong>Example:</strong> Automating smoke tests ensures critical functionality
                                    works after every code deployment.
                                </p>
                            </div>

                            {/* Principle 6 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>6. Customer-Centric Testing</h3>
                                <p>
                                    Agile testing focuses on delivering value to customers. Testers validate that the
                                    product meets real-world needs and expectations.
                                </p>
                                <p>
                                    <strong>Example:</strong> Conducting user acceptance testing (UAT) with real users
                                    ensures features align with customer workflows.
                                </p>
                            </div>

                            {/* Principle 7 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>7. Embrace Change</h3>
                                <p>
                                    Agile teams view changing requirements as an opportunity, not a challenge. Testers
                                    adapt quickly to shifts in priorities, ensuring that testing supports evolving
                                    goals.
                                </p>
                                <p>
                                    <strong>Example:</strong> When a new feature is prioritized mid-sprint, testers
                                    adjust their plans to accommodate the change seamlessly.
                                </p>
                            </div>

                            {/* Principle 8 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>8. Collaborate with Stakeholders</h3>
                                <p>
                                    Testers work closely with stakeholders to define acceptance criteria, ensuring clear
                                    understanding and alignment on quality expectations.
                                </p>
                                <p>
                                    <strong>Example:</strong> Collaboration between product owners and testers helps
                                    refine user stories with testable acceptance criteria.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Benefits */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Agile Testing Principles</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Reduced defect rates by identifying issues early.</li>
                            <li>Faster time-to-market due to continuous integration and testing.</li>
                            <li>Enhanced team collaboration and shared responsibility for quality.</li>
                            <li>Higher customer satisfaction with products tailored to their needs.</li>
                            <li>Improved adaptability to changing requirements and priorities.</li>
                        </ul>
                    </section>

                    {/* Section: Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile Testing Principles empower teams to build high-quality software in dynamic
                            environments. By emphasizing collaboration, adaptability, and continuous feedback, these
                            principles ensure that testing aligns with Agile values and delivers products that meet
                            customer expectations. Implementing these principles is essential for successful Agile
                            practices.
                        </p>
                    </section>
                </div>

            ),
            "Role of Tester in Agile": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fbfc', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Role of Tester in Agile</h1>

                    {/* Section: Introduction */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Introduction</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            In Agile methodologies, the role of a tester goes beyond traditional testing
                            responsibilities. Testers are collaborative team members who contribute to quality assurance
                            throughout the development cycle. They actively participate in planning, design,
                            development, and continuous feedback, ensuring the delivery of high-quality software that
                            meets customer needs.
                        </p>
                    </section>

                    {/* Section: Key Responsibilities */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Responsibilities of a Tester in
                            Agile</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '1000px',
                            margin: '30px auto',
                            color: '#7f8c8d'
                        }}>
                            {/* Responsibility 1 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>1. Collaborating with the Team</h3>
                                <p>
                                    Testers work closely with developers, product owners, and other stakeholders to
                                    understand requirements, define test strategies, and ensure alignment with project
                                    goals.
                                </p>
                                <p>
                                    <strong>Example:</strong> Participating in daily stand-ups and sprint planning
                                    meetings to discuss progress, issues, and testing priorities.
                                </p>
                            </div>

                            {/* Responsibility 2 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>2. Defining and Refining Test Cases</h3>
                                <p>
                                    Testers collaborate with the team to write, review, and refine test cases based on
                                    user stories and acceptance criteria, ensuring test coverage aligns with customer
                                    expectations.
                                </p>
                                <p>
                                    <strong>Example:</strong> Creating test cases in alignment with behavior-driven
                                    development (BDD) practices, such as writing "Given-When-Then" scenarios.
                                </p>
                            </div>

                            {/* Responsibility 3 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>3. Performing Continuous Testing</h3>
                                <p>
                                    Agile testers perform testing throughout the development cycle, including unit
                                    testing, integration testing, regression testing, and exploratory testing.
                                </p>
                                <p>
                                    <strong>Example:</strong> Conducting exploratory tests on new features during
                                    sprints to uncover potential edge cases and usability issues.
                                </p>
                            </div>

                            {/* Responsibility 4 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>4. Automating Tests</h3>
                                <p>
                                    Testers design and implement automated tests to improve efficiency, reduce
                                    repetitive work, and ensure quick feedback on code changes.
                                </p>
                                <p>
                                    <strong>Example:</strong> Using tools like Selenium or Cypress to automate
                                    regression test suites for faster execution during each sprint.
                                </p>
                            </div>

                            {/* Responsibility 5 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>5. Ensuring Continuous Feedback</h3>
                                <p>
                                    Testers provide regular feedback to the team on software quality, usability, and
                                    potential risks, helping the team make informed decisions.
                                </p>
                                <p>
                                    <strong>Example:</strong> Sharing insights during sprint retrospectives to improve
                                    testing strategies and overall team processes.
                                </p>
                            </div>

                            {/* Responsibility 6 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>6. Supporting UAT and Stakeholder Feedback</h3>
                                <p>
                                    Testers facilitate User Acceptance Testing (UAT) by preparing test environments,
                                    guiding stakeholders, and addressing feedback.
                                </p>
                                <p>
                                    <strong>Example:</strong> Working with customers to validate functionality in a
                                    real-world context during UAT sessions.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Skills of an Agile Tester */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Skills of an Agile Tester</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Strong communication and collaboration skills.</li>
                            <li>Proficiency in test automation tools and scripting languages.</li>
                            <li>Adaptability to changing requirements and priorities.</li>
                            <li>Critical thinking and analytical problem-solving abilities.</li>
                            <li>Understanding of Agile frameworks like Scrum and Kanban.</li>
                            <li>Focus on customer-centric testing and usability validation.</li>
                        </ul>
                    </section>

                    {/* Section: Benefits of Agile Testers */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Agile Testers</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Improved product quality through continuous testing and feedback.</li>
                            <li>Enhanced team collaboration and shared ownership of quality.</li>
                            <li>Faster identification and resolution of defects.</li>
                            <li>Better alignment of testing efforts with customer needs.</li>
                            <li>Increased efficiency through test automation and iterative improvements.</li>
                        </ul>
                    </section>

                    {/* Section: Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The role of a tester in Agile extends beyond traditional testing, focusing on collaboration,
                            continuous feedback, and quality assurance throughout the development cycle. By embracing
                            Agile principles, testers help deliver high-quality, customer-focused software in a dynamic
                            and fast-paced environment.
                        </p>
                    </section>
                </div>

            ),
        },
        "Agile Testing Life Cycle": {
            "Introduction to Agile Testing Life Cycle": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f8', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Introduction to Agile Testing Life Cycle</h1>

                    {/* Section: Introduction */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Agile Testing Life Cycle?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The Agile Testing Life Cycle is a crucial aspect of Agile methodologies, where testing is
                            not a separate phase but an integral part of the entire development process. Unlike
                            traditional testing, Agile testing is continuous, adaptive, and iterative, allowing testers
                            to provide ongoing feedback and adjust strategies as the project evolves. The Agile Testing
                            Life Cycle aligns closely with Agile development cycles, ensuring that quality assurance is
                            embedded in every aspect of the software lifecycle.
                        </p>
                    </section>

                    {/* Section: Phases of Agile Testing Life Cycle */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Phases of the Agile Testing Life Cycle</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '1000px',
                            margin: '30px auto',
                            color: '#7f8c8d'
                        }}>
                            {/* Phase 1 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>1. Requirement Analysis</h3>
                                <p>
                                    In this phase, the Agile tester works closely with the product owner, business
                                    analysts, and developers to understand user stories, acceptance criteria, and
                                    project goals. This collaboration ensures that testers fully understand the features
                                    to be developed and how the requirements will be tested.
                                </p>
                                <p>
                                    <strong>Example:</strong> Reviewing user stories and acceptance criteria to identify
                                    testable features and ensuring clarity before development begins.
                                </p>
                            </div>

                            {/* Phase 2 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>2. Test Planning</h3>
                                <p>
                                    Unlike traditional testing, Agile test planning happens continuously. Testers plan
                                    and prepare tests based on the user stories and acceptance criteria. The planning
                                    process also includes the identification of testing tools, test environments, and
                                    automation strategies.
                                </p>
                                <p>
                                    <strong>Example:</strong> Collaborating with the development team to plan automated
                                    test scripts for user stories that are scheduled for development.
                                </p>
                            </div>

                            {/* Phase 3 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>3. Test Design</h3>
                                <p>
                                    During the test design phase, testers create detailed test cases and test scenarios
                                    based on the requirements and user stories. The focus is on designing tests that are
                                    simple, concise, and aligned with Agile principles, ensuring continuous feedback
                                    throughout the development cycle.
                                </p>
                                <p>
                                    <strong>Example:</strong> Creating BDD (Behavior-Driven Development) scenarios such
                                    as “Given-When-Then” for functional testing.
                                </p>
                            </div>

                            {/* Phase 4 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>4. Test Execution</h3>
                                <p>
                                    Test execution in Agile happens throughout the sprint. As features are developed,
                                    testers execute the test cases, focusing on both functional and non-functional
                                    testing (e.g., performance and security). Continuous testing provides immediate
                                    feedback to the team, allowing issues to be detected and resolved quickly.
                                </p>
                                <p>
                                    <strong>Example:</strong> Executing automated tests and manual tests as new features
                                    are developed, ensuring any defects are quickly identified.
                                </p>
                            </div>

                            {/* Phase 5 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>5. Defect Reporting and Management</h3>
                                <p>
                                    In this phase, testers report defects, track issues, and collaborate with developers
                                    to resolve them. Since Agile emphasizes continuous improvement, testers work with
                                    the team to improve processes and minimize the occurrence of similar defects in
                                    future iterations.
                                </p>
                                <p>
                                    <strong>Example:</strong> Reporting defects in a project management tool like Jira
                                    and ensuring they are prioritized based on severity.
                                </p>
                            </div>

                            {/* Phase 6 */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>6. Retrospective and Feedback</h3>
                                <p>
                                    At the end of each iteration, the Agile team holds a retrospective to review what
                                    went well and what can be improved in the next sprint. This phase helps the team
                                    reflect on testing practices, identify any gaps in coverage, and continuously
                                    improve the Agile testing process.
                                </p>
                                <p>
                                    <strong>Example:</strong> Reviewing test results and discussing ways to improve test
                                    automation and reduce the time taken for manual testing.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Characteristics of Agile Testing */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Characteristics of Agile Testing</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Continuous feedback loop for improvement throughout the development cycle.</li>
                            <li>Emphasis on collaboration and communication among the Agile team members.</li>
                            <li>Testers are involved early in the process and continuously throughout the sprint.</li>
                            <li>Focus on delivering working software that meets customer needs with quality and
                                reliability.
                            </li>
                            <li>Testing is done at all stages of development, from unit testing to UAT (User Acceptance
                                Testing).
                            </li>
                            <li>Embracing changes in requirements and priorities even late in the development cycle.
                            </li>
                        </ul>
                    </section>

                    {/* Section: Benefits of Agile Testing Life Cycle */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Agile Testing Life Cycle</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Improved product quality through continuous and iterative testing.</li>
                            <li>Faster time-to-market due to frequent delivery of working software increments.</li>
                            <li>Better alignment of testing with customer needs and evolving requirements.</li>
                            <li>Reduced risk of defects with early and continuous feedback from testers.</li>
                            <li>Increased team collaboration and shared responsibility for software quality.</li>
                        </ul>
                    </section>

                    {/* Section: Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The Agile Testing Life Cycle is fundamental in Agile development as it ensures quality is
                            built into the product from the very beginning. Testers are involved throughout the
                            development cycle, providing continuous feedback and collaborating with other team members
                            to ensure the product meets both functional and non-functional requirements. This iterative
                            and collaborative approach helps deliver high-quality software quickly and efficiently.
                        </p>
                    </section>
                </div>

            ),
            "Testing Techniques in Agile": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f8', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Testing Techniques in Agile</h1>

                    {/* Section: Introduction */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What are Testing Techniques in Agile?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Testing techniques in Agile focus on providing quick and effective feedback, ensuring that
                            software meets user requirements with high quality. Agile testing techniques are an
                            essential part of the Agile methodology, where testing is integrated into every phase of the
                            development process. These techniques support continuous testing and improvement throughout
                            the software lifecycle, helping teams maintain high standards of quality.
                        </p>
                    </section>

                    {/* Section: Common Agile Testing Techniques */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Common Agile Testing Techniques</h2>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '30px',
                            maxWidth: '1000px',
                            margin: '30px auto',
                            color: '#7f8c8d'
                        }}>
                            {/* Test-Driven Development (TDD) */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>1. Test-Driven Development (TDD)</h3>
                                <p>
                                    Test-Driven Development (TDD) is a technique where developers write tests before
                                    writing the code. This ensures that the code written is always covered by tests and
                                    that the software is designed to meet the requirements from the outset. TDD
                                    encourages simple, incremental code changes and helps catch defects early in the
                                    development cycle.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Helps ensure that code is designed with testability in
                                    mind and reduces defects early.
                                </p>
                            </div>

                            {/* Behavior-Driven Development (BDD) */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>2. Behavior-Driven Development (BDD)</h3>
                                <p>
                                    Behavior-Driven Development (BDD) builds on TDD by encouraging collaboration between
                                    developers, testers, and domain experts to define the behavior of the software. In
                                    BDD, tests are written in plain, readable language using the “Given-When-Then”
                                    format. This makes it easier for non-technical stakeholders to understand test cases
                                    and ensures that the software meets user expectations.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Encourages collaboration across teams and ensures the
                                    product meets the user's needs.
                                </p>
                            </div>

                            {/* Exploratory Testing */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>3. Exploratory Testing</h3>
                                <p>
                                    Exploratory Testing is a technique where testers actively explore the software
                                    without predefined test cases. Testers simultaneously learn about the system, design
                                    tests, and execute them on the fly. This technique is particularly valuable for
                                    uncovering unexpected defects and improving test coverage in areas that may not have
                                    been thoroughly tested.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Enables testers to uncover hidden defects and gain a
                                    deeper understanding of the application.
                                </p>
                            </div>

                            {/* Acceptance Test-Driven Development (ATDD) */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>4. Acceptance Test-Driven Development (ATDD)</h3>
                                <p>
                                    Acceptance Test-Driven Development (ATDD) is a collaborative approach in which
                                    developers, testers, and product owners define acceptance criteria for each user
                                    story before the development begins. The acceptance tests are then used to validate
                                    whether the user story has been implemented correctly. ATDD ensures that the
                                    delivered features meet business expectations.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Aligns the development team with business requirements
                                    and ensures features meet user expectations.
                                </p>
                            </div>

                            {/* Continuous Integration and Continuous Testing */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>5. Continuous Integration and Continuous Testing</h3>
                                <p>
                                    Continuous Integration (CI) is a practice where developers integrate code changes
                                    frequently into a shared repository. This integration triggers automated tests to
                                    verify the functionality of the changes. Continuous Testing is the practice of
                                    running automated tests continuously throughout the development cycle to ensure that
                                    software quality is maintained. Together, these practices allow for early
                                    identification of defects and faster release cycles.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Early detection of defects, reduced time to market,
                                    and improved software quality.
                                </p>
                            </div>

                            {/* Smoke Testing */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>6. Smoke Testing</h3>
                                <p>
                                    Smoke Testing is a high-level test technique where testers verify that the most
                                    critical functionalities of the application are working correctly after a new build
                                    or deployment. It is not meant to find detailed defects but to ensure that the build
                                    is stable enough for further testing.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Quickly identifies issues in the build that would
                                    prevent further testing.
                                </p>
                            </div>

                            {/* Regression Testing */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>7. Regression Testing</h3>
                                <p>
                                    Regression Testing ensures that new code changes do not negatively affect the
                                    existing functionality of the application. This technique is critical in Agile,
                                    where frequent iterations and releases occur. Automated testing is commonly used to
                                    execute regression tests efficiently, ensuring that new features or bug fixes do not
                                    introduce new defects.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Maintains the stability of the application while new
                                    features are being added.
                                </p>
                            </div>

                            {/* Pair Testing */}
                            <div>
                                <h3 style={{color: '#2c3e50'}}>8. Pair Testing</h3>
                                <p>
                                    Pair Testing involves two testers working together on the same system to identify
                                    defects. One tester is the “driver,” who controls the system, while the other is the
                                    “navigator,” who provides guidance and ensures comprehensive test coverage. This
                                    technique promotes collaboration and knowledge sharing between team members.
                                </p>
                                <p>
                                    <strong>Key Benefit:</strong> Encourages collaboration and helps identify defects
                                    that may be missed when working alone.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section: Benefits of Agile Testing Techniques */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Agile Testing Techniques</h2>
                        <ul style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '30px auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Improved software quality due to continuous testing and feedback.</li>
                            <li>Faster delivery of features through early and frequent releases.</li>
                            <li>Increased collaboration among teams, improving communication and shared responsibility
                                for quality.
                            </li>
                            <li>Flexibility in responding to changing requirements or business needs.</li>
                            <li>Reduced defects and more reliable applications due to early defect detection.</li>
                        </ul>
                    </section>

                    {/* Section: Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile testing techniques are essential for teams aiming to build high-quality software in a
                            collaborative and fast-paced environment. The adoption of techniques like TDD, BDD,
                            exploratory testing, and continuous integration ensures that testing is integrated
                            throughout the Agile development lifecycle. These techniques enable teams to catch defects
                            early, deliver features quickly, and continuously improve the product to meet the needs of
                            the users.
                        </p>
                    </section>
                </div>

            ),
        },
        "Popular Agile Frameworks and Methodologies": {
            "Popular Agile Frameworks and Methodologies": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f8', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Popular Agile Frameworks and Methodologies</h1>

                    {/* Section: Introduction */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What are Agile Frameworks and
                            Methodologies?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile frameworks and methodologies are a set of approaches and principles used in software
                            development to encourage flexibility, collaboration, and continuous improvement. They
                            provide
                            teams with guidance on how to structure their workflows, manage tasks, and ensure quality
                            while delivering value to customers. The most widely used Agile methodologies include Scrum,
                            Kanban, Extreme Programming (XP), Lean Development, Crystal, and Dynamic Systems Development
                            Method (DSDM).
                        </p>
                    </section>

                    {/* Section: Scrum */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>1. Scrum</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Scrum is one of the most popular Agile frameworks that focuses on delivering
                                high-quality
                                products in short, iterative cycles called sprints. Scrum provides a structured approach
                                with specific roles, artifacts, and ceremonies to facilitate team collaboration and
                                accountability.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Components of Scrum:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Roles:</strong> Scrum Master, Product Owner, and Development Team.</li>
                                <li><strong>Artifacts:</strong> Product Backlog, Sprint Backlog, and Increment.</li>
                                <li><strong>Ceremonies:</strong> Sprint Planning, Daily Scrum, Sprint Review, and Sprint
                                    Retrospective.
                                </li>
                                <li><strong>Sprint Structure:</strong> Scrum operates in time-boxed iterations called
                                    sprints (usually 2-4 weeks), where teams plan, execute, and review their work.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Kanban */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>2. Kanban</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Kanban is a visual framework that focuses on continuous delivery without overburdening
                                the
                                team. It uses a Kanban board to visualize the flow of work, manage work-in-progress
                                (WIP),
                                and prioritize tasks. Kanban aims to increase efficiency by focusing on workflow and
                                ensuring that teams can manage and execute tasks incrementally.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Concepts in Kanban:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Workflow Visualization:</strong> Visual boards (physical or digital) are
                                    used
                                    to represent work items, which are tracked through various stages (e.g., To Do, In
                                    Progress, Done).
                                </li>
                                <li><strong>WIP Limits:</strong> Work-In-Progress limits help reduce multitasking and
                                    bottlenecks by restricting the number of tasks being worked on at once.
                                </li>
                                <li><strong>Continuous Delivery:</strong> Kanban encourages continuous delivery of
                                    features, where teams focus on completing tasks rather than working in sprints.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Extreme Programming (XP) */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>3. Extreme Programming (XP)</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Extreme Programming (XP) is an Agile methodology that focuses on engineering practices,
                                collaboration, and improving software quality through continuous feedback. It emphasizes
                                customer satisfaction, communication, and rapid iterations with frequent releases.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Practices in XP:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Test-Driven Development (TDD):</strong> Writing automated tests before
                                    writing
                                    the actual code, ensuring the software works as expected and maintains high test
                                    coverage.
                                </li>
                                <li><strong>Pair Programming:</strong> Two developers work together at one workstation,
                                    improving code quality through continuous collaboration and knowledge sharing.
                                </li>
                                <li><strong>Continuous Integration:</strong> Frequent integration of code into the main
                                    repository ensures that the software is always in a deployable state, reducing
                                    integration issues.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Lean Development */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>4. Lean Development</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Lean Development focuses on eliminating waste, improving efficiency, and optimizing the
                                flow of value to the customer. This methodology draws on principles from Lean
                                manufacturing and encourages the continuous improvement of processes while minimizing
                                non-value-adding activities.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Principles of Lean Development:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Eliminate Waste:</strong> Focus on reducing waste (e.g., unnecessary
                                    meetings,
                                    defects, rework) to streamline the development process.
                                </li>
                                <li><strong>Optimize Flow:</strong> Improve the flow of work by minimizing delays and
                                    improving efficiency.
                                </li>
                                <li><strong>Build Quality In:</strong> Ensure quality is built into the process by
                                    continuously testing and integrating feedback throughout the development cycle.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Crystal */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>5. Crystal</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Crystal is an Agile methodology that emphasizes adaptability and flexibility based on
                                the
                                size and complexity of the project. Unlike other Agile methodologies, Crystal advocates
                                tailoring the process to fit the specific needs of the project, ensuring that the team
                                is
                                empowered to make decisions and improve processes.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Features of Crystal:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Adaptability:</strong> Crystal tailors its practices based on the size of
                                    the
                                    team, project complexity, and priority.
                                </li>
                                <li><strong>Focus on Communication:</strong> Crystal promotes face-to-face
                                    communication,
                                    collaboration, and frequent feedback.
                                </li>
                                <li><strong>Lightweight Processes:</strong> It provides a lightweight approach with
                                    minimal overhead for small teams while allowing flexibility in larger teams.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Section: Dynamic Systems Development Method (DSDM) */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>6. Dynamic Systems Development Method
                            (DSDM)</h2>
                        <div style={{maxWidth: '1000px', margin: '30px auto', color: '#7f8c8d'}}>
                            <p>
                                Dynamic Systems Development Method (DSDM) is an Agile methodology focused on governance,
                                project control, and stakeholder engagement. It is a highly structured framework
                                designed
                                to deliver business solutions in a timely and cost-effective manner.
                            </p>
                            <h3 style={{color: '#2c3e50'}}>Key Elements of DSDM:</h3>
                            <ul style={{
                                fontSize: '1.2em',
                                paddingLeft: '20px',
                                marginBottom: '20px'
                            }}>
                                <li><strong>Governance:</strong> Strong focus on project governance to ensure the
                                    delivery
                                    of value, scope, and objectives are aligned with stakeholder expectations.
                                </li>
                                <li><strong>Stakeholder Engagement:</strong> Active involvement of stakeholders
                                    throughout
                                    the project to ensure continuous alignment with business goals.
                                </li>
                                <li><strong>Iterative Development:</strong> DSDM emphasizes incremental delivery and the
                                    flexibility to adjust priorities as business needs evolve.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile frameworks provide diverse approaches to managing software development projects. From
                            Scrum’s structured sprint cycles to Kanban’s flexible flow of work, each framework offers
                            unique practices and principles that help teams deliver high-quality software efficiently.
                            Whether focusing on continuous delivery, test-driven development, or stakeholder
                            collaboration, choosing the right Agile methodology depends on the needs and nature of the
                            project.
                        </p>
                    </section>
                </div>

            ),
            "Scrum": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Scrum in Agile</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Scrum?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Scrum is a popular Agile framework that enables teams to deliver high-quality software
                            incrementally and iteratively.
                            It divides the work into smaller, manageable parts called "sprints," which usually last 1-4
                            weeks. Scrum emphasizes transparency, collaboration, and flexibility, ensuring teams can
                            quickly adapt to changing requirements and improve through regular feedback loops.
                        </p>
                    </section>

                    {/* Scrum Roles Section */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Scrum Roles</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            In Scrum, three key roles work collaboratively to ensure the success of the project. These
                            roles have clear responsibilities and are crucial for the Scrum process to run effectively.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Product Owner */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/product-owner-logo.png"
                                    alt="Product Owner"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Product Owner</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Product Owner is responsible for defining and prioritizing the product backlog,
                                    ensuring the development team understands what needs to be built and the order in
                                    which it should be done. The Product Owner collaborates closely with stakeholders to
                                    ensure the team delivers the most valuable features first.
                                </p>
                            </div>

                            {/* Scrum Master */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/scrum-master-logo.png"
                                    alt="Scrum Master"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Scrum Master</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Scrum Master acts as a facilitator, ensuring that Scrum processes are followed
                                    and helping the team to remove any obstacles or impediments that may slow down
                                    progress. The Scrum Master ensures that the Scrum framework is being applied
                                    effectively, promoting a healthy team dynamic and continuous improvement.
                                </p>
                            </div>

                            {/* Development Team */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/development-team-logo.png"
                                    alt="Development Team"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Development Team</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Development Team is composed of cross-functional members responsible for
                                    designing, building, and testing the product. They collaborate closely with the
                                    Product Owner and Scrum Master to deliver the product increment during each sprint.
                                    The team is self-organizing and collectively responsible for achieving the sprint
                                    goals.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Scrum Ceremonies Section */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Scrum Ceremonies</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Scrum ceremonies are essential meetings that bring the Scrum team together to collaborate,
                            plan, and review progress. These ceremonies ensure that the team is aligned and on track to
                            achieve its goals.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Sprint Planning */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/sprint-planning-logo.png"
                                    alt="Sprint Planning"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Sprint Planning</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Sprint Planning is a ceremony where the Scrum team defines the work to be done
                                    during the upcoming sprint. The Product Owner presents the prioritized backlog
                                    items, and the Development Team collaborates to determine which items can be
                                    completed in the sprint. The team also defines the sprint goal, which guides their
                                    work throughout the sprint.
                                </p>
                            </div>

                            {/* Daily Standups */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/daily-standup-logo.png"
                                    alt="Daily Standups"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Daily Standups</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Daily Standup is a short (usually 15-minute) meeting held every day during the
                                    sprint. The Development Team discusses what they accomplished the previous day, what
                                    they plan to work on today, and any obstacles they are facing. This meeting promotes
                                    transparency and quick identification of issues that may hinder progress.
                                </p>
                            </div>

                            {/* Sprint Review */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/sprint-review-logo.png"
                                    alt="Sprint Review"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Sprint Review</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Sprint Review takes place at the end of the sprint and involves demonstrating
                                    the completed work to stakeholders, including the Product Owner and other relevant
                                    parties. The team reviews the work completed against the sprint goal and discusses
                                    any changes to the product backlog based on feedback received.
                                </p>
                            </div>

                            {/* Retrospective */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/retrospective-logo.png"
                                    alt="Retrospective"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Retrospective</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Retrospective is a meeting held at the end of each sprint where the Scrum team
                                    reflects on the sprint and identifies ways to improve their processes. The goal is
                                    continuous improvement, and the team discusses what went well, what didn’t, and how
                                    they can work better in the next sprint.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Scrum Artifacts Section */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Scrum Artifacts</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Scrum artifacts provide transparency and opportunities for inspection and adaptation. These
                            artifacts help track progress and ensure that everyone in the team is aligned with the
                            project goals.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Product Backlog */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/product-backlog-logo.png"
                                    alt="Product Backlog"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Product Backlog</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Product Backlog is a prioritized list of features, enhancements, bug fixes, and
                                    other work items that the team will work on. The Product Owner is responsible for
                                    managing the backlog, ensuring that it reflects the priorities of the stakeholders
                                    and the value of the features.
                                </p>
                            </div>

                            {/* Sprint Backlog */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/sprint-backlog-logo.png"
                                    alt="Sprint Backlog"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Sprint Backlog</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Sprint Backlog is a list of tasks or work items selected from the Product
                                    Backlog that the team aims to complete during the sprint. It represents the team’s
                                    commitment for the sprint and is updated daily during the sprint.
                                </p>
                            </div>

                            {/* Increment */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/increment-logo.png"
                                    alt="Increment"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Increment</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Increment is the sum of all the Product Backlog items completed during a sprint.
                                    It must be in a usable and potentially shippable state, ensuring that the team
                                    delivers value at the end of each sprint.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Scrum provides a framework for Agile teams to manage and deliver high-quality software in a
                            collaborative and efficient manner. By defining clear roles, ceremonies, and artifacts,
                            Scrum ensures that the team is aligned, adaptable, and continuously improving.
                        </p>
                    </section>
                </div>

            ),
            "Kanban": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Kanban in Agile</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Kanban?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Kanban is a lean and Agile framework used to manage and improve workflows in a visual and
                            incremental manner. It focuses on continuous delivery, flexibility, and managing work in
                            progress (WIP) to optimize efficiency. Unlike other Agile methodologies that follow specific
                            timeboxes, Kanban allows for continuous flow and delivery, making it ideal for environments
                            that require ongoing work, such as support or maintenance teams.
                        </p>
                    </section>

                    {/* Key Principles of Kanban */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Principles of Kanban</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Kanban is based on a few key principles that help teams visualize workflows, limit
                            work-in-progress, and deliver value continuously. These principles ensure that work flows
                            smoothly, bottlenecks are identified early, and teams can respond flexibly to changing
                            priorities.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Visualizing Workflows */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/kanban-board-logo.png"
                                    alt="Visualizing Workflows"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Visualizing Workflows</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    One of the core principles of Kanban is to visualize the entire workflow. This is
                                    typically done using a Kanban board, where work items move through different stages
                                    of the workflow (e.g., To Do, In Progress, Done). By visualizing work, teams gain
                                    transparency into the status of tasks, helping to identify bottlenecks and areas for
                                    improvement.
                                </p>
                            </div>

                            {/* Limiting Work-In-Progress */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/wip-limit-logo.png"
                                    alt="Limiting Work-in-Progress"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Limiting Work-in-Progress (WIP)</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Kanban emphasizes limiting the amount of work-in-progress (WIP) at any given time.
                                    By setting WIP limits for each stage in the workflow, teams can focus on completing
                                    tasks before starting new ones. This helps prevent overloading team members, reduces
                                    multitasking, and ensures that work is completed efficiently.
                                </p>
                            </div>

                            {/* Continuous Delivery */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/continuous-delivery-logo.png"
                                    alt="Continuous Delivery"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Continuous Delivery</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Kanban supports continuous delivery, where work is delivered as soon as it is ready.
                                    Teams aim to ensure a smooth flow of work through each stage, from start to finish.
                                    Continuous delivery minimizes delays and enables teams to deliver value to customers
                                    faster and more consistently.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Key Metrics in Kanban */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Metrics in Kanban</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Kanban provides several metrics to help teams monitor their performance and improve their
                            processes. These metrics provide insights into the flow of work and help identify areas for
                            improvement. The most important metrics include Cycle Time and Lead Time.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Cycle Time */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/cycle-time-logo.png"
                                    alt="Cycle Time"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Cycle Time</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Cycle Time measures the time it takes for a work item to move through the entire
                                    workflow, from the moment it is started to when it is completed. This metric helps
                                    teams understand how long it takes to deliver work, allowing them to identify
                                    bottlenecks and areas for process improvement.
                                </p>
                            </div>

                            {/* Lead Time */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/lead-time-logo.png"
                                    alt="Lead Time"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Lead Time</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Lead Time measures the total time from when a work item is requested (or added to
                                    the backlog) to when it is completed. This metric includes both the cycle time and
                                    the waiting time (i.e., time a work item spends waiting for attention). Lead time is
                                    an important metric for understanding customer expectations and the responsiveness
                                    of the team.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Kanban is a powerful Agile framework that enables teams to manage and optimize workflows by
                            focusing on visualizing work, limiting WIP, and enabling continuous delivery. By using key
                            metrics like Cycle Time and Lead Time, teams can monitor and improve their processes to
                            ensure efficient delivery of value. Kanban is particularly well-suited for teams that need
                            flexibility, continuous improvement, and a focus on delivering value in a steady flow.
                        </p>
                    </section>
                </div>

            ),
            "Extreme Programming (XP)": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Extreme Programming (XP) in Agile</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Extreme Programming (XP)?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Extreme Programming (XP) is an Agile software development methodology that emphasizes
                            technical excellence, continuous improvement, and frequent releases of small, functional
                            pieces of software. XP aims to improve software quality and responsiveness to changing
                            customer requirements by emphasizing collaboration, simplicity, feedback, and courage. It
                            encourages a highly iterative approach with a focus on both technical practices and
                            communication between all team members.
                        </p>
                    </section>

                    {/* Key Practices of XP */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Practices of Extreme Programming</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            XP includes a set of practices that aim to improve the quality of software, enhance
                            collaboration between team members, and ensure that the software meets customer needs. These
                            practices are designed to promote continuous feedback and rapid adaptation to changes.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Pair Programming */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/pair-programming-logo.png"
                                    alt="Pair Programming"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Pair Programming</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Pair Programming involves two developers working together at the same workstation.
                                    One writes code while the other reviews it. This practice improves code quality
                                    through constant review and sharing of knowledge between team members, leading to
                                    fewer bugs and faster problem-solving.
                                </p>
                            </div>

                            {/* Test-Driven Development (TDD) */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/tdd-logo.png"
                                    alt="Test-Driven Development (TDD)"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Test-Driven Development (TDD)</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Test-Driven Development (TDD) is a practice where developers write automated tests
                                    before writing the code that will pass them. This ensures that the code is testable,
                                    helps identify design flaws early, and improves code reliability by continuously
                                    validating functionality as development progresses.
                                </p>
                            </div>

                            {/* Continuous Integration (CI) */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/ci-logo.png"
                                    alt="Continuous Integration"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Continuous Integration (CI)</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Continuous Integration involves frequently integrating code changes into the main
                                    branch. By automating the integration process, XP ensures that new code is
                                    immediately tested and integrated, which reduces bugs, conflicts, and delays, and
                                    ensures that the software remains in a working state at all times.
                                </p>
                            </div>

                            {/* Collective Code Ownership */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/collective-code-ownership-logo.png"
                                    alt="Collective Code Ownership"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Collective Code Ownership</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    In XP, all team members share ownership of the codebase. This practice ensures that
                                    any developer can improve or modify any part of the code at any time. This increases
                                    flexibility, promotes team collaboration, and ensures that no part of the code
                                    becomes a bottleneck due to lack of knowledge or expertise.
                                </p>
                            </div>

                            {/* Simple Design */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/simple-design-logo.png"
                                    alt="Simple Design"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Simple Design</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    XP promotes keeping the design of the software as simple as possible. Simple design
                                    helps developers to avoid unnecessary complexity, making the code easier to maintain
                                    and extend. It encourages the use of the simplest solution that works, with a focus
                                    on refactoring as the software evolves.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* The Role of Communication in XP */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>The Role of Communication in XP</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Communication is at the heart of Extreme Programming. XP relies on regular and direct
                            communication between all team members, stakeholders, and customers. By maintaining open
                            channels of communication, teams can quickly address issues, adapt to changing requirements,
                            and ensure that the product aligns with customer needs. Key communication practices in XP
                            include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Frequent communication between developers, customers, and stakeholders.</li>
                            <li>Daily standups and regular pair programming sessions to foster collaboration.</li>
                            <li>Collaborative decision-making to ensure alignment with the project's goals.</li>
                        </ul>
                    </section>

                    {/* Benefits of Extreme Programming */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Extreme Programming</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Extreme Programming offers numerous benefits, especially for teams working in dynamic
                            environments that require flexibility, constant feedback, and high-quality software. The
                            main benefits of XP include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>Improved software quality through rigorous testing and continuous integration.</li>
                            <li>Faster delivery of working software with frequent releases and customer feedback.</li>
                            <li>Enhanced team collaboration and communication, leading to a more productive work
                                environment.
                            </li>
                            <li>Greater customer satisfaction by continuously aligning development with customer needs
                                and feedback.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Extreme Programming (XP) is an Agile methodology designed to deliver high-quality software
                            through a focus on collaboration, technical excellence, and customer feedback. Its key
                            practices, such as Pair Programming, Test-Driven Development (TDD), Continuous Integration
                            (CI), and Simple Design, help teams build maintainable, scalable software. With a strong
                            emphasis on communication and adaptability, XP provides a robust framework for teams
                            striving for continuous improvement in a rapidly changing environment.
                        </p>
                    </section>
                </div>

            ),
        },
        "Agile Testing Tools": {
            "Popular Tools for Agile Testing": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f8', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Popular Tools for Agile Testing</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What are Agile Testing Tools?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile testing tools are designed to support the iterative, fast-paced, and collaborative
                            nature of Agile development. These tools help teams automate testing, manage test cases, and
                            ensure that software quality is maintained throughout the development process. They support
                            various testing activities such as test automation, continuous integration, bug tracking,
                            and test management, all crucial in Agile environments.
                        </p>
                    </section>

                    {/* Section for Test Automation Tools */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>1. Test Automation Tools</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Test automation is a critical aspect of Agile testing as it accelerates the feedback loop,
                            reduces manual intervention, and improves efficiency. Below are some of the most popular
                            test automation tools used in Agile projects:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Selenium */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/selenium-logo.png"
                                    alt="Selenium"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Selenium</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Selenium is one of the most widely used open-source test automation tools for web
                                    applications. It supports multiple browsers and programming languages, making it
                                    ideal for Agile teams working with diverse technologies. Selenium integrates well
                                    with other testing frameworks and tools like Jenkins for continuous integration and
                                    reporting.
                                </p>
                            </div>

                            {/* JUnit */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/junit-logo.png"
                                    alt="JUnit"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>JUnit</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    JUnit is a widely used testing framework for Java applications, primarily used for
                                    unit testing. It is a core part of the Agile testing process as it allows testers
                                    and developers to write automated tests for individual units of code. JUnit
                                    integrates with other tools like Jenkins and Maven for continuous integration and
                                    delivery.
                                </p>
                            </div>

                            {/* Appium */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/appium-logo.png"
                                    alt="Appium"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Appium</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Appium is a cross-platform mobile testing tool that supports Android and iOS. It
                                    allows teams to write automated tests for mobile applications using various
                                    programming languages such as Java, Ruby, and Python. Appium is popular in Agile
                                    environments due to its flexibility and ability to integrate with other tools.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section for Continuous Integration Tools */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>2. Continuous Integration Tools</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Continuous integration (CI) is a key practice in Agile environments that enables teams to
                            merge their code changes frequently, often multiple times a day. The following CI tools help
                            automate the build, test, and deployment processes, ensuring smooth and continuous delivery:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Jenkins */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/jenkins-logo.png"
                                    alt="Jenkins"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Jenkins</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Jenkins is a widely used open-source CI tool that automates the build, test, and
                                    deployment processes. It is highly extensible with a vast plugin ecosystem, making
                                    it suitable for Agile teams working with different programming languages and tools.
                                    Jenkins is often used in conjunction with tools like Selenium for automated testing.
                                </p>
                            </div>

                            {/* CircleCI */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/circleci-logo.png"
                                    alt="CircleCI"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>CircleCI</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    CircleCI is a cloud-based CI/CD tool that automates the testing and deployment of
                                    applications. It offers fast feedback loops, making it an excellent choice for Agile
                                    teams who need to quickly detect and resolve issues. CircleCI integrates with tools
                                    like GitHub and Bitbucket to ensure smooth workflow management.
                                </p>
                            </div>

                            {/* Travis CI */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/travisci-logo.png"
                                    alt="Travis CI"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Travis CI</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Travis CI is another popular CI tool, particularly known for its ease of use and
                                    integration with GitHub. It automates the testing and deployment process, ensuring
                                    that changes to the codebase are immediately tested and validated in real-time.
                                    Travis CI supports many programming languages and integrates well with Agile tools.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Section for Test Management Tools */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>3. Test Management Tools</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Test management tools help Agile teams organize, manage, and track test cases, test runs,
                            and defects. These tools enhance collaboration, ensure better traceability, and improve
                            visibility into testing progress.
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* TestRail */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/testrail-logo.png"
                                    alt="TestRail"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>TestRail</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    TestRail is a web-based test case management tool that enables teams to organize,
                                    manage, and track their testing efforts. It allows easy integration with bug
                                    tracking tools like Jira and provides detailed reports and metrics on test
                                    execution. TestRail is popular in Agile teams due to its ease of use and robust
                                    features.
                                </p>
                            </div>

                            {/* Zephyr */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/zephyr-logo.png"
                                    alt="Zephyr"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Zephyr</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Zephyr is a popular test management tool integrated with Jira, providing Agile teams
                                    with seamless test case management and execution tracking. With Zephyr, teams can
                                    plan and execute test cases, track progress, and generate real-time reporting—all
                                    directly within Jira.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile testing tools play a vital role in improving efficiency, enabling faster feedback, and
                            ensuring software quality. By automating tests, managing test cases, and integrating with
                            continuous integration tools, these tools empower Agile teams to maintain a steady pace of
                            development and deliver high-quality software. The choice of tools depends on the project’s
                            needs, team preferences, and existing toolchain.
                        </p>
                    </section>
                </div>

            ),
            "Automated Testing in Agile": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f8', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Automated Testing in Agile</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Automated Testing in Agile?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Automated testing in Agile refers to the use of software tools and scripts to automatically
                            execute tests on the software to ensure that it functions as expected. In Agile
                            methodologies, where development cycles are short, and the focus is on continuous delivery
                            and frequent releases, automated testing is essential. It accelerates the feedback loop,
                            increases test coverage, and allows for consistent and repeatable testing, ensuring quality
                            throughout the development process.
                        </p>
                    </section>

                    {/* Benefits Section */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Automated Testing in Agile</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Automated testing offers several benefits that are particularly useful in Agile environments
                            where speed, flexibility, and constant feedback are essential. These benefits include:
                        </p>

                        <ul style={{
                            listStyleType: 'circle',
                            color: '#7f8c8d',
                            fontSize: '1.1em',
                            marginTop: '20px',
                            marginLeft: '40px'
                        }}>
                            <li><strong>Faster Feedback</strong>: Automated tests run quickly and can provide immediate
                                feedback to developers, enabling them to fix issues promptly and move forward with
                                development.
                            </li>
                            <li><strong>Higher Test Coverage</strong>: Automated tests can cover more scenarios, edge
                                cases, and workflows, ensuring that the application behaves as expected in various
                                conditions.
                            </li>
                            <li><strong>Repeatability</strong>: Once automated tests are created, they can be executed
                                as many times as needed, ensuring consistent quality across different builds and
                                environments.
                            </li>
                            <li><strong>Cost Efficiency</strong>: Although setting up automated testing requires an
                                initial investment, over time, it reduces the need for manual intervention, lowering
                                overall testing costs in the long run.
                            </li>
                            <li><strong>Parallel Execution</strong>: Automated tests can be executed in parallel across
                                different platforms or environments, significantly speeding up testing cycles and
                                reducing the time to market.
                            </li>
                        </ul>
                    </section>

                    {/* Types of Automated Testing */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Types of Automated Testing in Agile</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Automated testing in Agile can be categorized into several types of testing, each serving a
                            different purpose in the development lifecycle. Some of the most common types include:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Unit Testing */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/unit-testing-logo.png"
                                    alt="Unit Testing"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Unit Testing</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Unit testing involves testing individual components or units of code to ensure they
                                    function correctly in isolation. Automated unit tests are critical for detecting
                                    issues early in development, particularly in Agile environments where frequent
                                    changes are made to the codebase.
                                </p>
                            </div>

                            {/* Integration Testing */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/integration-testing-logo.png"
                                    alt="Integration Testing"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Integration Testing</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Integration testing verifies that different parts of the application work together.
                                    Automated integration tests ensure that various system components and external
                                    services are properly integrated, reducing the chances of defects arising from
                                    communication issues.
                                </p>
                            </div>

                            {/* Regression Testing */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/regression-testing-logo.png"
                                    alt="Regression Testing"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Regression Testing</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    Regression testing ensures that new code changes have not introduced new defects
                                    into the existing codebase. In Agile, where frequent changes are made, automated
                                    regression testing is essential to catch unintended consequences quickly and
                                    efficiently.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* Best Practices for Automated Testing in Agile */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Best Practices for Automated Testing in
                            Agile</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            To maximize the effectiveness of automated testing in Agile, teams should follow certain
                            best practices. These practices ensure that tests are well-organized, easy to maintain, and
                            provide maximum value. Some of these best practices include:
                        </p>

                        <ul style={{
                            listStyleType: 'circle',
                            color: '#7f8c8d',
                            fontSize: '1.1em',
                            marginTop: '20px',
                            marginLeft: '40px'
                        }}>
                            <li><strong>Test Early and Often</strong>: In Agile, testing should be integrated into every
                                phase of the development process. Start testing early to catch defects sooner and
                                continuously run tests to ensure quality is maintained.
                            </li>
                            <li><strong>Keep Tests Small and Isolated</strong>: Automated tests should be focused on
                                small units or components of the application to ensure that issues are quickly
                                identified. Avoid complex tests that involve multiple dependencies.
                            </li>
                            <li><strong>Maintain a Solid Test Suite</strong>: Ensure that your test suite is
                                well-organized, easy to maintain, and scalable. This allows the team to add new tests as
                                the project grows without slowing down the development process.
                            </li>
                            <li><strong>Collaborate with Developers</strong>: Testers and developers should collaborate
                                closely to create effective automated tests. In Agile, testers often work alongside
                                developers to ensure that tests are comprehensive and effective.
                            </li>
                            <li><strong>Prioritize High-Risk Areas</strong>: Focus your automated tests on the most
                                critical and high-risk areas of the application. This helps catch the most significant
                                issues early, ensuring the stability of the product.
                            </li>
                        </ul>
                    </section>

                    {/* Challenges of Automated Testing in Agile */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Challenges of Automated Testing in
                            Agile</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Despite its benefits, automated testing in Agile presents several challenges, including:
                        </p>

                        <ul style={{
                            listStyleType: 'circle',
                            color: '#7f8c8d',
                            fontSize: '1.1em',
                            marginTop: '20px',
                            marginLeft: '40px'
                        }}>
                            <li><strong>Initial Setup Cost</strong>: Writing and maintaining automated tests require
                                upfront investment in time, effort, and resources.
                            </li>
                            <li><strong>Maintenance of Test Scripts</strong>: As the software evolves, automated tests
                                must be updated to accommodate changes, which can increase maintenance overhead.
                            </li>
                            <li><strong>False Positives/Negatives</strong>: Automated tests can sometimes give false
                                results, leading to wasted time debugging or overlooking issues.
                            </li>
                            <li><strong>Lack of Human Insight</strong>: Automated tests can't always replicate human
                                thinking or understand user experience, meaning manual testing is still needed to catch
                                some types of issues.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Automated testing plays a critical role in Agile development, allowing teams to keep pace
                            with rapid development cycles while ensuring high-quality software. By incorporating
                            automated testing, Agile teams can increase their efficiency, reduce manual errors, and
                            achieve faster feedback. However, to be successful, automated testing requires careful
                            planning, collaboration, and regular maintenance to adapt to changes in the software.
                        </p>
                    </section>
                </div>

            ),
        },
        "Scaling Agile": {
            "SAFe (Scaled Agile Framework)": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Scaled Agile Framework (SAFe)</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is SAFe?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The Scaled Agile Framework (SAFe) is a set of principles and practices for scaling Agile
                            practices across large organizations. SAFe provides a structured approach to implementing
                            Agile at scale, aligning teams, programs, and portfolios to drive agility across multiple
                            levels of an organization. By combining Agile, lean, and product development flow
                            principles,
                            SAFe helps organizations deliver value faster and more efficiently, improve product quality,
                            and enhance collaboration among teams.
                        </p>
                    </section>

                    {/* Core Components of SAFe */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Core Components of SAFe</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            SAFe is structured to work across multiple levels within an organization. These levels
                            include:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Team Level */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/team-level-logo.png"
                                    alt="Team Level"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Team Level</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Team level is the foundational level where Agile teams, typically using Scrum or
                                    Kanban, work together to deliver incremental value. Teams work on defined tasks and
                                    user stories during a sprint, with a focus on delivering small, shippable product
                                    increments.
                                </p>
                            </div>

                            {/* Program Level */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/program-level-logo.png"
                                    alt="Program Level"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Program Level</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Program level focuses on organizing teams into agile release trains (ARTs),
                                    which
                                    are teams working together on a shared mission. The ART is aligned around a common
                                    set
                                    of objectives and delivers value in a coordinated manner, with a focus on iteration
                                    and program-level planning.
                                </p>
                            </div>

                            {/* Large Solution Level */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/large-solution-level-logo.png"
                                    alt="Large Solution Level"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Large Solution Level</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Large Solution level coordinates multiple ARTs to deliver large-scale solutions
                                    that require significant integration. This level ensures that large, complex
                                    solutions
                                    align with business objectives, and includes practices like Solution Intent and
                                    Solution Backlog.
                                </p>
                            </div>

                            {/* Portfolio Level */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/portfolio-level-logo.png"
                                    alt="Portfolio Level"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Portfolio Level</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Portfolio level ensures that the work being done aligns with the organization's
                                    strategic goals and vision. It provides a framework for managing budgets,
                                    initiatives,
                                    and investments across multiple value streams, ensuring that the right work is
                                    prioritized and resources are properly allocated.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* SAFe Implementation Roadmap */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>SAFe Implementation Roadmap</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Implementing SAFe in an organization follows a structured roadmap that guides leaders
                            through
                            the process. The roadmap involves the following key steps:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Train Lean-Agile Change Agents**: Provide training to key stakeholders and leaders
                                to
                                understand SAFe principles.
                            </li>
                            <li>2. **Create a Lean-Agile Center of Excellence**: Establish a team of experts to support
                                the SAFe implementation.
                            </li>
                            <li>3. **Define the Value Streams**: Identify the value streams within the organization to
                                ensure alignment with business goals.
                            </li>
                            <li>4. **Implement Agile Release Trains (ARTs)**: Organize teams into ARTs that will work
                                together to deliver value in a coordinated manner.
                            </li>
                            <li>5. **Launch ARTs and Start Executing**: Begin delivering value using the ARTs, with
                                regular feedback loops to ensure continuous improvement.
                            </li>
                            <li>6. **Monitor Progress and Improve**: Continuously assess and adjust the implementation
                                to
                                ensure success and scalability.
                            </li>
                        </ul>
                    </section>

                    {/* Benefits of SAFe */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of SAFe</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The Scaled Agile Framework offers numerous benefits for large organizations that need to
                            scale
                            Agile practices across multiple teams and departments. These benefits include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Faster Time-to-Market**: SAFe accelerates the delivery of value through streamlined
                                processes and faster decision-making.
                            </li>
                            <li>2. **Improved Quality**: Continuous integration and testing practices ensure that
                                quality
                                is maintained throughout the development lifecycle.
                            </li>
                            <li>3. **Increased Collaboration**: SAFe promotes strong collaboration between business and
                                IT, improving alignment with customer needs.
                            </li>
                            <li>4. **Scalability**: SAFe is designed to scale to large organizations with multiple teams
                                and complex product portfolios, making it suitable for enterprises.
                            </li>
                            <li>5. **Better Risk Management**: By breaking work into manageable pieces and continuously
                                reviewing progress, SAFe helps organizations manage and mitigate risks more effectively.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px', textAlign: 'center'}}>
                        <h2 style={{color: '#16a085'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The Scaled Agile Framework (SAFe) is an effective methodology for scaling Agile practices
                            across large organizations. By aligning teams, programs, and portfolios to deliver value
                            faster and more efficiently, SAFe helps businesses achieve their strategic objectives.
                            Through
                            its structured approach, SAFe improves collaboration, reduces risks, and accelerates the
                            delivery of high-quality products. Whether you’re a small startup or a large enterprise,
                            implementing SAFe can significantly enhance your agility and operational efficiency.
                        </p>
                    </section>
                </div>

            ),
            "LeSS (Large-Scale Scrum)": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>LeSS (Large-Scale Scrum)</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is LeSS?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS (Large-Scale Scrum) is a framework designed for scaling Scrum in large organizations.
                            It extends Scrum's principles to multiple Scrum teams working together on a single product.
                            LeSS keeps the Scrum framework simple and focuses on delivering high-quality products with
                            minimal overhead, collaboration between teams, and aligning all teams with a common goal.
                            LeSS maintains the core principles of Scrum, such as self-organization and regular feedback,
                            while offering guidance for scaling.
                        </p>
                    </section>

                    {/* Key Principles of LeSS */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Principles of LeSS</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS is based on the same principles as Scrum, but it offers additional considerations for
                            scaling. The key principles of LeSS include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Transparency**: The same Scrum transparency principles apply in LeSS. Everyone has
                                visibility of the work, backlog, and progress, making it easier to understand what's
                                happening at every level.
                            </li>
                            <li>2. **Inspect and Adapt**: Regular retrospectives are held at multiple levels (team,
                                product, and organizational), ensuring that any issues are discovered and improvements
                                are implemented across the whole framework.
                            </li>
                            <li>3. **Simplicity**: LeSS values simplicity and strives to minimize the number of roles,
                                processes, and artifacts. The goal is to keep things as simple as possible while scaling
                                Scrum.
                            </li>
                            <li>4. **Collaboration and Self-Organization**: LeSS relies on collaboration between teams,
                                stakeholders, and management, with teams being self-organizing and empowered to make
                                decisions.
                            </li>
                        </ul>
                    </section>

                    {/* LeSS Framework Structure */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>LeSS Framework Structure</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The LeSS framework structure is built around Scrum principles but extended to scale for
                            multiple teams. There are two main configurations:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* LeSS Basic */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/less-basic-logo.png"
                                    alt="LeSS Basic"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>LeSS Basic</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    LeSS Basic is suitable for scaling up to 2-8 teams working on the same product. In
                                    this configuration, there is a single Product Backlog and one Product Owner, with
                                    each team working on the same sprint backlog.
                                </p>
                            </div>

                            {/* LeSS Huge */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/less-huge-logo.png"
                                    alt="LeSS Huge"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>LeSS Huge</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    LeSS Huge is designed for larger-scale projects, where the number of teams exceeds
                                    eight. In this configuration, the Product Backlog is divided into several
                                    sub-backlogs, each managed by a feature team. Each team works on their sprint goals,
                                    which contribute to the overall product development.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* LeSS Roles */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>LeSS Roles</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS maintains the same Scrum roles but with a few adjustments for scaling. The primary
                            roles in LeSS include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Product Owner**: There is a single Product Owner across all teams, who manages the
                                product backlog and prioritizes the work for the teams. In LeSS Huge, the Product Owner
                                works with several feature teams.
                            </li>
                            <li>2. **Scrum Master**: Each team has its own Scrum Master, who helps guide the team
                                through the Scrum processes and removes obstacles. Additionally, there is a Lead Scrum
                                Master at the program level who coordinates between teams.
                            </li>
                            <li>3. **Development Teams**: Teams are cross-functional and self-organizing. Each team
                                works collaboratively with the other teams to ensure that the overall product vision is
                                achieved. Teams are focused on completing work within sprints and delivering
                                high-quality increments.
                            </li>
                        </ul>
                    </section>

                    {/* LeSS Events */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>LeSS Events</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS events mirror those in Scrum, but with additional considerations for multiple teams
                            working together:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Sprint Planning**: At the start of the sprint, the teams meet to plan their work.
                                The teams share information and synchronize their work to ensure a cohesive product
                                increment.
                            </li>
                            <li>2. **Daily Scrum**: Each team holds a Daily Scrum to discuss progress, plans, and
                                obstacles. The entire group of teams can also hold a Scrum of Scrums to coordinate
                                across teams.
                            </li>
                            <li>3. **Sprint Review**: The teams collaborate to demonstrate the completed work and gather
                                feedback from stakeholders.
                            </li>
                            <li>4. **Sprint Retrospective**: Teams reflect on their processes, identify improvements,
                                and make adjustments for future sprints. This is done at both the team level and the
                                overall program level.
                            </li>
                        </ul>
                    </section>

                    {/* Benefits of LeSS */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of LeSS</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS offers several benefits when scaling Scrum across multiple teams:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Simplicity**: LeSS avoids the complexity of introducing many new roles or processes
                                and stays as close to Scrum as possible.
                            </li>
                            <li>2. **Increased Transparency**: Teams work collaboratively and share information openly,
                                improving visibility at all levels of the organization.
                            </li>
                            <li>3. **Better Coordination**: The structure of LeSS enables teams to coordinate their work
                                effectively, ensuring that all teams contribute to the same product increment.
                            </li>
                            <li>4. **Faster Delivery**: By organizing multiple teams around a single product backlog,
                                LeSS ensures that development proceeds in a synchronized and efficient manner.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            LeSS is an ideal framework for organizations looking to scale Scrum without adding
                            unnecessary complexity. It maintains Scrum’s core principles while introducing additional
                            considerations for multiple teams. LeSS focuses on simplicity, transparency, and
                            collaboration, enabling organizations to deliver high-quality products efficiently at scale.
                        </p>
                    </section>
                </div>
            ),
            "Disciplined Agile Delivery (DAD)": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f9fafb', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Disciplined Agile Delivery (DAD)</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>What is Disciplined Agile Delivery?</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Disciplined Agile Delivery (DAD) is a process decision framework for agile software
                            development. Unlike a single framework such as Scrum or Kanban, DAD provides a comprehensive
                            approach that helps teams select the best practices for their specific context. DAD offers a
                            disciplined and flexible way to scale agile practices across multiple teams and projects,
                            guiding teams through the different phases of the software delivery lifecycle, from
                            inception to delivery.
                        </p>
                    </section>

                    {/* Key Principles of DAD */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Key Principles of DAD</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            DAD is built on several guiding principles that help organizations deliver high-quality
                            software. The core principles of DAD include:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Holistic Approach**: DAD takes a holistic approach to software delivery,
                                considering all aspects of the lifecycle from architecture and design to deployment and
                                testing.
                            </li>
                            <li>2. **Contextual Tailoring**: DAD encourages teams to tailor agile practices based on the
                                specific needs of their project and organization, ensuring that the framework aligns
                                with the environment in which it is applied.
                            </li>
                            <li>3. **Phases of Delivery**: DAD divides the software development lifecycle into phases
                                (Inception, Construction, Transition), helping teams to plan, execute, and deploy
                                effectively.
                            </li>
                            <li>4. **Principles Over Practices**: DAD emphasizes the importance of principles rather
                                than just following a fixed set of practices. It encourages teams to adapt and evolve
                                based on real-world experiences and feedback.
                            </li>
                            <li>5. **Continuous Improvement**: The framework supports continuous reflection and
                                learning, helping teams improve their processes and outcomes with each iteration.
                            </li>
                        </ul>
                    </section>

                    {/* DAD Lifecycle Phases */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>DAD Lifecycle Phases</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            The DAD lifecycle consists of three major phases: Inception, Construction, and Transition.
                            These phases are designed to provide a structured approach to software delivery while
                            maintaining flexibility and adaptability. Let’s explore these phases:
                        </p>

                        <div style={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            justifyContent: 'center',
                            gap: '30px',
                            marginTop: '30px'
                        }}>
                            {/* Inception Phase */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/inception-phase.png"
                                    alt="Inception Phase"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Inception Phase</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Inception phase is focused on setting up the foundations of the project. During
                                    this phase, teams define the vision, scope, and architecture. The goal is to ensure
                                    that the project has a clear direction and is aligned with business objectives. This
                                    phase also involves high-level planning and risk identification.
                                </p>
                            </div>

                            {/* Construction Phase */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/construction-phase.png"
                                    alt="Construction Phase"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Construction Phase</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Construction phase is where the bulk of development happens. Teams work
                                    iteratively and incrementally, following agile practices to build working software.
                                    Key activities include coding, testing, and deploying in short iterations, allowing
                                    teams to adjust based on feedback. The focus is on delivering value early and
                                    continuously.
                                </p>
                            </div>

                            {/* Transition Phase */}
                            <div style={{maxWidth: '300px', textAlign: 'center'}}>
                                <img
                                    src="path/to/transition-phase.png"
                                    alt="Transition Phase"
                                    style={{width: '100%', height: 'auto', marginBottom: '15px', borderRadius: '8px'}}
                                />
                                <h3 style={{color: '#16a085'}}>Transition Phase</h3>
                                <p style={{color: '#7f8c8d'}}>
                                    The Transition phase involves deploying the software to the end users. It includes
                                    activities like user training, support planning, and finalizing the product for
                                    release. The goal is to ensure a smooth transition from development to production,
                                    minimizing disruptions and maximizing user satisfaction.
                                </p>
                            </div>
                        </div>
                    </section>

                    {/* DAD Roles */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>DAD Roles</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Disciplined Agile Delivery recognizes several roles that are important in delivering
                            software within the DAD framework. These roles focus on different aspects of the development
                            lifecycle and ensure smooth execution:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Architecture Owner**: The Architecture Owner is responsible for ensuring that the
                                system architecture is properly defined and maintained throughout the lifecycle of the
                                project. They make critical decisions about the technical direction.
                            </li>
                            <li>2. **Business Analyst**: The Business Analyst works with stakeholders to understand the
                                business needs and translate them into actionable requirements for the development team.
                            </li>
                            <li>3. **Development Team**: The Development Team consists of cross-functional team members
                                responsible for delivering the product increment. The team works collaboratively to
                                write code, create tests, and ensure that quality is maintained throughout the project.
                            </li>
                            <li>4. **Product Owner**: Similar to Scrum, the Product Owner in DAD is responsible for
                                managing the product backlog and ensuring that the team is delivering value that aligns
                                with customer needs and business goals.
                            </li>
                            <li>5. **Project Manager**: The Project Manager oversees the project’s progress, coordinates
                                activities between teams, and ensures that risks are mitigated. The Project Manager also
                                helps to align the project with organizational goals.
                            </li>
                        </ul>
                    </section>

                    {/* Benefits of DAD */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Benefits of Disciplined Agile Delivery
                            (DAD)</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            DAD provides several benefits that help teams and organizations deliver better software:
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li>1. **Flexibility**: DAD allows teams to tailor their practices based on the needs of the
                                project, making it adaptable to different contexts.
                            </li>
                            <li>2. **Holistic View**: DAD takes into account all aspects of the software delivery
                                lifecycle, ensuring that all roles, activities, and processes work in harmony.
                            </li>
                            <li>3. **Reduced Risk**: By following a disciplined approach, DAD reduces the risk of
                                project failure and helps teams deliver working software incrementally.
                            </li>
                            <li>4. **Improved Collaboration**: DAD promotes communication and collaboration between
                                business stakeholders, development teams, and other involved parties.
                            </li>
                            <li>5. **Continuous Improvement**: The framework encourages teams to continuously improve
                                and adapt their processes, leading to better results over time.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#16a085', textAlign: 'center'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Disciplined Agile Delivery (DAD) is a comprehensive framework that provides the flexibility
                            and structure required to deliver high-quality software in diverse and complex environments.
                            By emphasizing principles, adaptability, and continuous improvement, DAD helps teams tailor
                            agile practices to their unique context, resulting in successful project outcomes.
                        </p>
                    </section>
                </div>

            ),
            "Common Agile Testing Challenges": (
                <div style={{fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f6f9', padding: '40px'}}>
                    <h1 style={{textAlign: 'center', color: '#2c3e50'}}>Common Agile Testing Challenges</h1>

                    {/* Introduction Section */}
                    <section style={{marginTop: '40px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>Agile Testing in a Nutshell</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile testing refers to the process of testing software applications in an Agile development
                            environment. In Agile, development teams work in short iterations (or sprints) to deliver
                            small increments of functional software. Testing is integrated into each sprint to ensure
                            quality, but the fast-paced nature of Agile brings unique challenges. Let's explore some of
                            the common testing challenges faced by teams working in Agile methodologies.
                        </p>
                    </section>

                    {/* Testing Challenge 1: Changing Requirements */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>1. Changing Requirements</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            In Agile, requirements are expected to evolve continuously as feedback is received and as
                            business priorities shift. This means testers need to be flexible and adaptable, constantly
                            adjusting their test plans and scenarios as new features are introduced or priorities
                            change. Keeping up with these evolving requirements can lead to confusion and potential
                            testing gaps if not managed properly.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Test cases can quickly become outdated, and there’s a risk of
                                missing new test scenarios.
                            </li>
                            <li><strong>Solution:</strong> Close collaboration between testers, developers, and business
                                stakeholders to stay on top of requirement changes and re-evaluate test cases
                                frequently.
                            </li>
                        </ul>
                    </section>

                    {/* Testing Challenge 2: Time Constraints */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>2. Time Constraints</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile testing often occurs in tight, time-boxed sprints, typically lasting between one to
                            four weeks. The limited time frame means that testers must prioritize tasks, which can lead
                            to rushed testing or cutting corners in areas such as test case design, test execution, or
                            test coverage. Additionally, Agile teams are often under pressure to deliver working
                            software at the end of every sprint, leading to time constraints that complicate testing.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Testers may not have enough time to fully explore the
                                application, leading to incomplete test coverage.
                            </li>
                            <li><strong>Solution:</strong> Prioritize high-risk areas for testing and make use of
                                automation for regression testing, freeing up time for exploratory testing and critical
                                paths.
                            </li>
                        </ul>
                    </section>

                    {/* Testing Challenge 3: Integration and Continuous Testing */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>3. Integration and Continuous Testing</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            In Agile, testing is integrated into the continuous delivery pipeline, requiring that
                            testing be performed constantly throughout the development process. This makes it essential
                            to perform integration testing continuously as new code is integrated. However, this process
                            can be complex, especially with microservices or when many teams are working on different
                            components that need to interact with each other.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Issues related to integration and dependencies between systems
                                may arise, and it becomes difficult to ensure that all components work correctly
                                together.
                            </li>
                            <li><strong>Solution:</strong> Set up continuous integration (CI) pipelines and automate as
                                much testing as possible to reduce manual effort and improve efficiency.
                            </li>
                        </ul>
                    </section>

                    {/* Testing Challenge 4: Lack of Test Data */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>4. Lack of Test Data</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Effective testing requires realistic, diverse test data to ensure thorough coverage of
                            scenarios. In Agile, where development cycles are fast and iterative, test data is often not
                            available on time, or the available data may not be varied enough to cover all possible test
                            cases. Lack of comprehensive test data can prevent the testing process from being as
                            thorough as required.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Incomplete or unrealistic test data can lead to undetected
                                defects and gaps in test coverage.
                            </li>
                            <li><strong>Solution:</strong> Use data generation tools, mock data, or work closely with
                                stakeholders to ensure that realistic and sufficient test data is available throughout
                                the development lifecycle.
                            </li>
                        </ul>
                    </section>

                    {/* Testing Challenge 5: Collaboration and Communication Gaps */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>5. Collaboration and Communication Gaps</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Agile emphasizes close collaboration between developers, testers, and business stakeholders.
                            However, in fast-paced environments, there can be communication gaps or misunderstandings
                            between team members. This often results in testers working with unclear requirements,
                            incomplete user stories, or without sufficient context, making it difficult to design
                            appropriate test cases and deliver effective feedback.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Inadequate collaboration leads to missed requirements,
                                overlooked test cases, and ultimately reduced product quality.
                            </li>
                            <li><strong>Solution:</strong> Establish strong communication channels, regular feedback
                                loops, and daily standups to ensure everyone is aligned on goals and requirements.
                            </li>
                        </ul>
                    </section>

                    {/* Testing Challenge 6: Automation Overhead */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>6. Automation Overhead</h2>
                        <p style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            Test automation is essential in Agile environments due to the rapid development cycles.
                            However, maintaining automated tests and dealing with test flakiness can be a significant
                            overhead. Automated tests require continuous updates to match changes in the application,
                            and sometimes automation tools can create more overhead than they save, especially if they
                            are not properly maintained or executed.
                        </p>

                        <ul style={{
                            fontSize: '1.1em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto',
                            paddingLeft: '20px'
                        }}>
                            <li><strong>Impact:</strong> Poorly maintained or excessive automated tests can reduce the
                                effectiveness of automation, increase maintenance costs, and waste time.
                            </li>
                            <li><strong>Solution:</strong> Prioritize automating high-value, repeatable tests and ensure
                                that test automation is integrated with CI/CD pipelines to maintain test efficiency.
                            </li>
                        </ul>
                    </section>

                    {/* Conclusion */}
                    <section style={{marginTop: '50px'}}>
                        <h2 style={{color: '#3498db', textAlign: 'center'}}>Conclusion</h2>
                        <p style={{
                            fontSize: '1.2em',
                            color: '#7f8c8d',
                            textAlign: 'center',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}>
                            While Agile testing presents numerous challenges, they can be overcome with proper planning,
                            collaboration, and the right tools. By adapting to the fast-paced nature of Agile and
                            embracing flexibility, teams can ensure they are delivering high-quality software that meets
                            customer expectations. Agile testing is about continuous improvement, and addressing these
                            common challenges will help teams refine their processes and deliver better results.
                        </p>
                    </section>
                </div>

            ),
        },
    };

    // Render the selected tutorial content
    const renderContent = () => {
        return activeTutorial ? (
            <div className="content mt-3">

                <div >{activeTutorial.content}</div>
            </div>
        ) : (
            <div style={{marginTop: '30px', padding: '20px', backgroundColor: '#ecf0f1', borderRadius: '8px'}}>
                <p style={{fontSize: '1em', color: '#34495e', lineHeight: '1.8'}}>Select a topic and tutorial to view content.</p>
            </div>
        );
    };

    return (
        <div>
            <div className="container-fluid mt-5">
                <div className="row justify-content-left">
                    {/* Sidebar */}
                    <aside className="col-md-3 col-lg-2 sidebar">
                        <Accordion defaultActiveKey="0">
                            {Object.entries(contentData).map(([topic, tutorials], topicIndex) => (
                                <Card key={topic}>
                                    <Accordion.Item eventKey={String(topicIndex)}>
                                        <Accordion.Header>{topic}</Accordion.Header>
                                        <Accordion.Body>
                                            <ul className="list-unstyled">
                                                {Object.entries(tutorials).map(([tutorialTitle, tutorialContent]) => (
                                                    <li key={tutorialTitle}>
                                                        <Button
                                                            variant="link"
                                                            onClick={() =>
                                                                setActiveTutorial({
                                                                    title: tutorialTitle,
                                                                    content: tutorialContent
                                                                })
                                                            }
                                                            className="w-100 text-start"
                                                        >
                                                            {tutorialTitle}
                                                        </Button>
                                                    </li>
                                                ))}
                                            </ul>
                                        </Accordion.Body>
                                    </Accordion.Item>
                                </Card>
                            ))}
                        </Accordion>
                    </aside>

                    {/* Main Content */}
                    <main className="col-md-9 col-lg-8 p-4">
                        {renderContent()}
                    </main>
                </div>
            </div>
        </div>
    );
};

export default AgileTesting;
