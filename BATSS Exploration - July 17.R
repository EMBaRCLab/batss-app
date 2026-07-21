#install.packages('BATSS')
library(BATSS)
library(ggplot2)

# logit is a helper function
logit = function(p){log(p/(1 - p))}

trials1 <- batss.glm(
  model = y~group, # Fixed argument
  family          = "binomial",
  link            = "logit",
  var = list(y=rbinom, group=alloc.balanced), # Fixed argument
  var.control = list(y=list(size=1)), # Fixed argument
  prob0 = c(A=1, B=1), # Fixed argument (Default to even randomization)
  alternative = "greater", # lesser if negative outcome (Q1B)
  beta=c(logit(0.4), 0.2), # adjust 0.4 to proportion in Q2
  which=2, # Fixed argument (for 2 arm trial)
  eff.arm = eff.arm.simple,
  eff.arm.control = list(b = 0.95), # Adjust b per Q3
  delta.eff = 0, # Adjust delta.eff per Q3
  fut.arm = NULL,
  N=216, # Adjust based on Q4 input
  interim=list(recruited=list(m0=60, m=12)), # Adjust based on Q5/6
  R = 10, # User enters input for Q7
  extended=2 # Fixed argument, for now...
)

# saveRDS(trials1, "some path") #save output as a file so we can load it on the output screen

summary1 <- summary(trials1)


library(ggplot2)

# Build table of trial outcomes
df <- rbind(
  data.frame(
    Scenario = "H0",
    groupB = summary1$H0$scenario$groupB,
    overall = summary1$H0$scenario$overall
  ),
  data.frame(
    Scenario = "H1",
    groupB = summary1$H1$scenario$groupB,
    overall = summary1$H1$scenario$overall
  )
)
# Label and order outcomes
df$groupB <- factor(df$groupB, levels = c(0, 1), labels=c("Inconclusive", "B Superior"))

# Wisam - could you also have the output screen present these numbers in this table after a reshape
# Outcome       H0 proportions    H1 proportions
# B Superior     ...
# Inconclusive    

# Plotting code - display this table 
ggplot(df, aes(x = Scenario, y = overall, fill = groupB)) +
  geom_col(width = 0.7) +
  
  geom_hline(
    aes(yintercept = 0.05, colour = "Type I Error Target (5%)"),
    linetype = "dashed",
    linewidth = 1,
    show.legend = TRUE
  ) +
  geom_hline(
    aes(yintercept = 0.80, colour = "Power Target (80%)"),
    linetype = "dashed",
    linewidth = 1,
    show.legend = TRUE
  ) +
  scale_colour_manual(
    name = "Reference",
    values = c(
      "Type I Error Target (5%)" = "firebrick",
      "Power Target (80%)" = "steelblue"
    )
  ) +
  scale_fill_manual(
    name = "Conclusions",
    values = c(
      "B Superior" = "#2E8B57",
      "Inconclusive" = "#BDBDBD"
    )
  )+
  guides(
    fill = guide_legend(
      override.aes = list(
        linetype = 0,
        colour = NA
      )
    )
  ) +
  labs(y = "Proportion of Simulated Trials")

# I haven't fully thought through how using B in the input would impact the later use of groupB
# but prioritized getting some code to work with first. 