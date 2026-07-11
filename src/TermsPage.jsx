import React from 'react';
import { LegalShell, LegalH2, LegalH3, LegalP, LegalUl, LegalLi } from './PublicPages';

const UPDATED = 'July 2026';

export default function TermsPage() {
  return (
    <LegalShell title="Terms of Service" updated={UPDATED}>
      <LegalP>
        These Terms of Service ("Terms") are a contract between you and Trbo, registered at 301/19-21 Wilson St,
        Botany NSW 2019, Australia ("Trbo," "we," "us"). They govern your use of the Trbo indoor cycling training
        application, website, and related services (together, the "Service"). By creating an account or using the
        Service you agree to these Terms. If you don't agree, don't use the Service.
      </LegalP>

      <LegalH2>1. The Service</LegalH2>
      <LegalP>
        Trbo is a structured indoor cycling training application. It provides a library of periodized workouts, an
        AI-driven training plan builder, ERG-mode control of compatible smart trainers over Bluetooth, ride history
        and analytics, and mini-games layered on top of structured sessions. Some functionality — in particular
        smart trainer control — requires a compatible device and, in most cases, our native mobile app rather than a
        browser, because major mobile browsers do not currently support the Web Bluetooth features ERG mode relies
        on.
      </LegalP>

      <LegalH2>2. Accounts</LegalH2>
      <LegalP>
        You need an account to use most of the Service. You're responsible for the accuracy of the information you
        give us, for keeping your login credentials confidential, and for all activity that happens under your
        account. Tell us promptly at Trbo.help@outlook.com if you think your account has been accessed without your
        permission.
      </LegalP>
      <LegalP>
        You must be at least 16 years old to create a Trbo account. The Service is not directed at children and we
        do not knowingly collect personal information from anyone under 16.
      </LegalP>
      <LegalP>
        From time to time we may pause new account creation — for example while we prepare a relaunch — without that
        affecting your existing account or subscription in any way.
      </LegalP>

      <LegalH2>3. Subscriptions, trials, and payment</LegalH2>
      <LegalP>
        Core training features require a paid subscription after any free trial period ends. Subscriptions are
        billed in advance on a recurring basis (monthly or annually, as you select) and renew automatically until
        cancelled. Payment is processed by Stripe; we don't store your full card details ourselves.
      </LegalP>
      <LegalP>
        If a free trial is offered, its length will be shown to you at signup. You can cancel before a trial ends to
        avoid being charged. If you don't cancel, your subscription begins automatically at the end of the trial.
      </LegalP>
      <LegalH3>Refunds and cooling-off</LegalH3>
      <LegalP>
        If you're located in the European Union or United Kingdom, you have a statutory right to withdraw from a
        distance contract within 14 days of purchase without giving a reason, per the EU/UK Consumer Rights
        Directive. Because Trbo is a digital service, this right ends early if you actively start using the paid
        features (i.e. begin a structured or ERG-mode ride) with your express consent to lose the withdrawal right
        in exchange for immediate access — we'll ask for that consent at checkout before charging you. Outside of
        that 14-day window, and outside the EU/UK, refunds are handled at our discretion; contact
        Trbo.help@outlook.com and we'll take a reasonable look.
      </LegalP>
      <LegalH3>Cancellation</LegalH3>
      <LegalP>
        You can cancel anytime from within the app; your subscription remains active until the end of the current
        billing period, and you won't be charged again after that.
      </LegalP>

      <LegalH2>4. Smart trainer connectivity and physical safety</LegalH2>
      <LegalP>
        You're responsible for your own physical safety while training, including setting up your bike, trainer, and
        surrounding space appropriately, and for stopping if something feels wrong. Trbo is a training tool, not
        medical advice or a medical device — talk to a doctor before starting a new exercise program if that's
        appropriate for you. ERG mode adjusts trainer resistance automatically based on the workout you select;
        you're responsible for confirming your trainer is set up correctly and for stopping a session if the
        resistance feels unsafe.
      </LegalP>

      <LegalH2>5. The AI-driven plan builder</LegalH2>
      <LegalP>
        Trbo's plan builder uses automated, algorithmic logic — informed by the goal, schedule, and hours you provide
        — to select and sequence workouts into a personalized training plan, and to decide how often a given
        workout is repeated. This is an automated decision about what training content you're shown; no human
        reviews each plan individually before it's presented to you. You can always browse, choose, and ride
        workouts outside the generated plan, and you can regenerate or adjust a plan at any time. The plan builder
        does not make any decision with legal or similarly significant effect on you.
      </LegalP>

      <LegalH2>6. Pricing</LegalH2>
      <LegalP>
        Current subscription pricing is US$5.99/month or US$65.89/year (equivalent to 11 months paid upfront, with
        the 12th month free). Prices are shown in the app and at trbo.help/pricing and may change from time to time;
        if we change the price of your existing subscription we'll give you reasonable advance notice before it
        takes effect on your next renewal.
      </LegalP>

      <LegalH2>7. Acceptable use</LegalH2>
      <LegalUl>
        <LegalLi>Don't reverse-engineer, scrape, or attempt to extract the Service's underlying software, workout library, or plan-building logic for competitive use.</LegalLi>
        <LegalLi>Don't share a single account across multiple people in a way that circumvents subscription pricing.</LegalLi>
        <LegalLi>Don't use the Service to upload or transmit unlawful, abusive, or infringing content.</LegalLi>
        <LegalLi>Don't attempt to interfere with the Service's security, availability, or the smart trainer connections of other users.</LegalLi>
      </LegalUl>

      <LegalH2>8. Third-party integrations</LegalH2>
      <LegalP>
        You can optionally connect third-party services such as Strava to export ride data. Your use of those
        services is governed by their own terms; we're not responsible for how they handle data once it leaves
        Trbo.
      </LegalP>

      <LegalH2>9. Intellectual property</LegalH2>
      <LegalP>
        The Service, including its workout library, software, plan-building logic, and branding, is owned by Trbo
        and protected by intellectual property law. We grant you a personal, non-transferable licence to use the
        Service for your own training. You retain ownership of your own ride data.
      </LegalP>

      <LegalH2>10. Disclaimers and limitation of liability</LegalH2>
      <LegalP>
        The Service is provided "as is." To the extent permitted by law, Trbo disclaims warranties of any kind and
        isn't liable for indirect, incidental, or consequential damages arising from your use of the Service,
        including any injury sustained while training. Nothing in these Terms excludes or limits any consumer
        guarantee that can't lawfully be excluded, including under the Australian Consumer Law.
      </LegalP>

      <LegalH2>11. Termination</LegalH2>
      <LegalP>
        You may stop using the Service and cancel your subscription at any time. We may suspend or terminate an
        account for breach of these Terms, including abusive behaviour or non-payment, and will give notice where
        practical.
      </LegalP>

      <LegalH2>12. Governing law</LegalH2>
      <LegalP>
        These Terms are governed by the laws of New South Wales, Australia, without regard to conflict-of-laws
        principles, except where local mandatory consumer-protection law in your own country gives you additional
        rights that can't be contracted away.
      </LegalP>

      <LegalH2>13. Changes to these Terms</LegalH2>
      <LegalP>
        We may update these Terms from time to time. Material changes will be flagged in the app or by email before
        they take effect. Continuing to use the Service after a change takes effect means you accept the updated
        Terms.
      </LegalP>

      <LegalH2>14. Contact</LegalH2>
      <LegalP>
        Trbo, 301/19-21 Wilson St, Botany NSW 2019, Australia. Email: Trbo.help@outlook.com.
      </LegalP>
    </LegalShell>
  );
}
