import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Bot, Megaphone, Target, TrendingUp, Users } from "lucide-react"

const services = [
  {
    icon: Bot,
    title: "AI-Powered Analytics",
    description:
      "Advanced machine learning algorithms analyze your data to provide actionable insights and predict market trends.",
  },
  {
    icon: Megaphone,
    title: "Digital Marketing Automation",
    description:
      "Streamline your marketing campaigns with intelligent automation that optimizes performance in real-time.",
  },
  {
    icon: Target,
    title: "Precision Targeting",
    description: "Reach your ideal customers with laser-focused targeting powered by AI-driven audience analysis.",
  },
  {
    icon: BarChart3,
    title: "Performance Tracking",
    description: "Monitor your campaigns with comprehensive dashboards and real-time performance metrics.",
  },
  {
    icon: TrendingUp,
    title: "Growth Optimization",
    description: "Continuously optimize your strategies based on data-driven insights to maximize growth potential.",
  },
  {
    icon: Users,
    title: "Customer Journey Mapping",
    description: "Understand and optimize every touchpoint in your customer's journey for better conversions.",
  },
]

export function Services() {
  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-card/50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-4">
            Our <span className="text-primary">AI-Powered</span> Services
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto px-2 sm:px-0">
            Leverage cutting-edge artificial intelligence to transform your business operations and drive unprecedented
            growth.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => (
            <Card key={index} className="bg-card border-border hover:border-primary/50 transition-colors group h-full">
              <CardHeader className="pb-4">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
                  <div className="p-2.5 sm:p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors flex-shrink-0">
                    <service.icon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg sm:text-xl text-card-foreground leading-tight">
                    {service.title}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription className="text-muted-foreground leading-relaxed text-sm sm:text-base">
                  {service.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
