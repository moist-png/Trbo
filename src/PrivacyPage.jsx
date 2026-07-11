import React from 'react';
import { LegalShell, LegalH2, LegalH3, LegalP, LegalUl, LegalLi, LegalTable } from './PublicPages';

const UPDATED = 'July 2026';

export default function PrivacyPage() {
  return (
    <LegalShell title="Privacy Policy" updated={UPDATED}>
      <LegalP>
        This Privacy Policy explains how Trbo, registered at 301/19-21 Wilson St, Botany NSW 2019, Australia
        ("Trbo," "we," "us"), collects, uses, and protects personal information through the Trbo indoor cycling
        training application and website (the "Service"). It's written to comply with the Australian Privacy Act
        1988 (Cth), including the Australian Privacy Principles (APPs), and the EU/UK General Data Protection
        Regulation (GDPR) for people located in the European Union or United Kingdom.
      </LegalP>

      <LegalH2>1. Information we collect</LegalH2>
      <LegalTable
        headers={['Category', 'Examples']}
        rows={[
          ['Account information', 'Name, email address, hashed password (or OAuth identity if you sign in with Google or Apple)'],
          ['Training data', 'Workouts completed, power/cadence/speed data recorded during a ride, ride history, personal bests, plan preferences (goal, available days, hours per week)'],
          ['Device connection data', 'Bluetooth-paired trainer identifiers, used only to connect and control your own trainer during a session'],
          ['Payment information', 'Handled directly by Stripe; we receive only subscription status, plan tier, and billing history — never your full card number'],
          ['Support communications', 'Anything you send us at Trbo.help@outlook.com'],
          ['Technical data', 'Device type, app version, and basic diagnostic/error logs'],
          ['Third-party integration data', 'If you connect Strava, the ride data you choose to export there'],
        ]}
      />

      <LegalH3>Heart rate data</LegalH3>
      <LegalP>
        If you connect a heart rate monitor, your heart rate is displayed to you live during a ride and can be
        included in an export you initiate (for example, to Strava). We do not store or persist heart rate data on
        our servers or in our database at any point — it exists only transiently for display and export, under your
        control. We made this design choice deliberately so that we don't hold special-category health data about
        you beyond what passes through your own device in the moment.
      </LegalP>

      <LegalH2>2. How we use information</LegalH2>
      <LegalUl>
        <LegalLi>To provide the Service: authenticate you, sync your ride history across devices, and control your trainer during a session.</LegalLi>
        <LegalLi>To generate your training plan: the plan builder uses the goal, schedule, and hours you provide, together with your workout history, to select and sequence sessions automatically. See Section 5 of the Terms of Service for how this automated process works and how to override it.</LegalLi>
        <LegalLi>To process payment and manage your subscription, via Stripe.</LegalLi>
        <LegalLi>To respond to support requests.</LegalLi>
        <LegalLi>To maintain security, diagnose faults, and improve the Service.</LegalLi>
        <LegalLi>To meet legal obligations, such as tax and accounting record-keeping.</LegalLi>
      </LegalUl>
      <LegalP>We do not sell personal information, and we do not use your training data to serve you third-party advertising.</LegalP>

      <LegalH2>3. Legal bases for processing (EU/UK users)</LegalH2>
      <LegalTable
        headers={['Purpose', 'Legal basis under GDPR']}
        rows={[
          ['Creating and running your account', 'Performance of a contract'],
          ['Generating your training plan', 'Performance of a contract'],
          ['Billing and subscription management', 'Performance of a contract'],
          ['Security, fraud prevention, diagnostics', 'Legitimate interests'],
          ['Marketing emails (only if you opt in)', 'Consent'],
          ['Tax and accounting records', 'Legal obligation'],
        ]}
      />

      <LegalH2>4. Automated decision-making</LegalH2>
      <LegalP>
        The training plan builder makes an automated decision about which workouts to sequence into your plan, based
        on rules and rotation logic applied to the goal, schedule, and history you provide. Under GDPR Article
        22, you have the right not to be subject to a decision based solely on automated processing where it
        produces legal or similarly significant effects — the plan builder does not produce effects of that kind; it
        only shapes which training content is suggested to you, and you can always browse the full library, choose
        any workout directly, or regenerate your plan instead of accepting its output.
      </LegalP>

      <LegalH2>5. Who we share information with</LegalH2>
      <LegalUl>
        <LegalLi><strong>Supabase</strong> — hosts our authentication system and database.</LegalLi>
        <LegalLi><strong>Stripe</strong> — processes subscription payments.</LegalLi>
        <LegalLi><strong>Vercel</strong> — hosts the application and website.</LegalLi>
        <LegalLi><strong>Strava</strong> — only if you actively choose to connect your account and export a ride.</LegalLi>
      </LegalUl>
      <LegalP>
        We don't sell or rent personal information to third parties, and we don't share it with anyone else except
        where required by law or to protect the rights, safety, or property of Trbo or our users.
      </LegalP>

      <LegalH2>6. International data transfers</LegalH2>
      <LegalP>
        Our service providers may process data outside your home country, including in the United States. Where
        personal information of EU/UK users is transferred outside the European Economic Area or United Kingdom, we
        rely on the European Commission's Standard Contractual Clauses (SCCs), or an equivalent UK-approved transfer
        mechanism, as the safeguard for that transfer.
      </LegalP>

      <LegalH2>7. Data retention</LegalH2>
      <LegalP>
        We keep account and training data for as long as your account is active, so your history and plan continue
        to work correctly. If you delete your account, we delete or de-identify your personal information within a
        reasonable period, except where we're required to retain certain records (such as billing history) for tax
        or legal purposes.
      </LegalP>

      <LegalH2>8. Your rights</LegalH2>
      <LegalP>Depending on where you live, you may have the right to:</LegalP>
      <LegalUl>
        <LegalLi>Access the personal information we hold about you.</LegalLi>
        <LegalLi>Correct inaccurate information.</LegalLi>
        <LegalLi>Delete your account and associated personal information.</LegalLi>
        <LegalLi>Export your data in a portable format.</LegalLi>
        <LegalLi>Object to, or ask us to restrict, certain processing.</LegalLi>
        <LegalLi>Withdraw consent at any time, where processing is based on consent.</LegalLi>
        <LegalLi>Lodge a complaint with a data protection regulator — in Australia, the Office of the Australian Information Commissioner (OAIC); in the EU/UK, your local supervisory authority.</LegalLi>
      </LegalUl>
      <LegalP>To exercise any of these rights, email Trbo.help@outlook.com. We'll respond within the timeframe required by applicable law.</LegalP>

      <LegalH2>9. Cancellation withdrawal right (EU/UK)</LegalH2>
      <LegalP>
        As described in our Terms of Service, EU/UK users have a 14-day right of withdrawal from a paid subscription
        under the Consumer Rights Directive, which ends early only if you give express consent to start using paid
        features immediately and do so before the 14 days are up.
      </LegalP>

      <LegalH2>10. Security</LegalH2>
      <LegalP>
        We use industry-standard measures — including encryption in transit, hashed passwords, and access controls
        on our database — to protect personal information. No system is completely secure, and we can't guarantee
        absolute security, but we work to keep information appropriately protected and will notify affected users
        and, where required, regulators, in the event of a data breach likely to result in risk to individuals.
      </LegalP>

      <LegalH2>11. Children</LegalH2>
      <LegalP>
        The Service isn't directed at children and isn't intended for use by anyone under 16. We don't knowingly
        collect personal information from children.
      </LegalP>

      <LegalH2>12. Changes to this policy</LegalH2>
      <LegalP>
        We may update this Privacy Policy from time to time. Material changes will be flagged in the app or by email
        before they take effect.
      </LegalP>

      <LegalH2>13. Contact</LegalH2>
      <LegalP>
        Trbo, 301/19-21 Wilson St, Botany NSW 2019, Australia. Email: Trbo.help@outlook.com.
      </LegalP>
    </LegalShell>
  );
}
