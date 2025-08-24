import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Award, CheckCircle, Users, Zap } from "lucide-react"
import Link from "next/link"

const achievements = [
  {
    icon: Users,
    number: "500+",
    label: "Happy Clients",
  },
  {
    icon: Award,
    number: "98%",
    label: "Success Rate",
  },
  {
    icon: Zap,
    number: "2M+",
    label: "Campaigns Optimized",
  },
]

const features = [
  "Advanced AI algorithms for predictive analytics",
  "Real-time campaign optimization",
  "Comprehensive performance tracking",
  "24/7 automated monitoring",
  "Custom dashboard and reporting",
  "Expert consultation and support",
]

export function About() {
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
              Why Choose <span className="text-primary">ADMIND</span>?
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              We're not just another marketing agency. ADMIND combines the power of artificial intelligence with deep
              marketing expertise to deliver results that traditional agencies simply can't match.
            </p>

            {/* Features List */}
            <div className="space-y-4 mb-8">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-foreground">{feature}</span>
                </div>
              ))}
            </div>

            <Link href="#contact">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Start Your Journey
              </Button>
            </Link>
          </div>

          {/* Stats Cards */}
          <div className="space-y-6">
            {achievements.map((achievement, index) => (
              <Card key={index} className="bg-card border-border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-primary/10 rounded-lg">
                      <achievement.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div>
                      <div className="text-3xl font-bold text-foreground">{achievement.number}</div>
                      <div className="text-muted-foreground">{achievement.label}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
