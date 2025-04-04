import { Header } from "@/components/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container py-6">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Help & FAQ</h1>
          <p className="text-muted-foreground mb-6">
            Find answers to common questions about our sports betting simulation
            platform.
          </p>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Getting Started</CardTitle>
              <CardDescription>
                Learn the basics of using our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>Is this real betting?</AccordionTrigger>
                  <AccordionContent>
                    No, this is a simulation platform. No real money is
                    involved. All funds and bets are simulated for entertainment
                    and educational purposes only.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>How do I place a bet?</AccordionTrigger>
                  <AccordionContent>
                    To place a bet, browse the available games and click on the
                    odds you want to bet on. This will add the selection to your
                    bet slip. You can add multiple selections to create an
                    accumulator bet. Once you're ready, enter your stake amount
                    in the bet slip and click "Place Bet".
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How do I add funds to my account?
                  </AccordionTrigger>
                  <AccordionContent>
                    Since this is a simulation platform, you can add virtual
                    funds to your account by going to your Account page and
                    clicking on "Add Funds". You'll start with a default balance
                    of $1,000 in simulation funds.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Betting Rules</CardTitle>
              <CardDescription>
                Understanding how betting works on our platform
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>How are odds calculated?</AccordionTrigger>
                  <AccordionContent>
                    Our platform uses simulated odds that mimic real-world
                    betting markets. The odds represent the probability of an
                    outcome happening, with lower odds indicating a higher
                    probability. For example, odds of 1.50 suggest a higher
                    chance of winning than odds of 3.00.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    What types of bets can I place?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can place single bets on individual games or accumulator
                    bets by combining multiple selections. We offer various
                    betting markets including match result (home win, draw, away
                    win), over/under goals, both teams to score, and correct
                    score predictions.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>
                    How are winnings calculated?
                  </AccordionTrigger>
                  <AccordionContent>
                    Winnings are calculated by multiplying your stake by the
                    odds of your selection. For accumulator bets, the odds of
                    all selections are multiplied together, and then multiplied
                    by your stake to determine potential winnings.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Account & Technical Support</CardTitle>
              <CardDescription>
                Help with your account and technical issues
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger>
                    How do I change my password?
                  </AccordionTrigger>
                  <AccordionContent>
                    You can change your password by going to Account Settings
                    and selecting the Password tab. You'll need to enter your
                    current password and then your new password twice to
                    confirm.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-2">
                  <AccordionTrigger>
                    Can I use this platform on mobile?
                  </AccordionTrigger>
                  <AccordionContent>
                    Yes, our platform is fully responsive and works on all
                    devices including smartphones and tablets. You can access
                    all features through your mobile browser without needing to
                    download an app.
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="item-3">
                  <AccordionTrigger>How do I contact support?</AccordionTrigger>
                  <AccordionContent>
                    For any issues or questions not covered in this FAQ, please
                    email us at support@betsim.example.com or use the contact
                    form on our Contact page. Our support team is available 24/7
                    to assist you.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
