---
title: Beginner's Guide
show_date: false
profile: true
---
## Read before you Leap
This document is a starter’s guide for students who are interested in project (BSc/MSc) or PhD
 with [me](https://mavens-group.github.io/author/rudra-banerjee/). For the duration of your
project you will become part of our [**MAVENs** team of graduate
students](http://mavens-group.github.io). I discuss here our research mission, our way of working,
the tools we use and provide some links to key scientific papers that relate to our research. This
guide is always a work in progress and each project will have its own goals and dynamics. Still,
generally speaking, I would appreciate if you have a look at the links and think about the issues
that I raise here. Talk to me when you have questions or ideas to improve this document.

## Research

### Mission

Energy is the cornerstone of modern civilization. However, the present fossil-fuel based energy is
a concern for two reasons:
- Its depleting source.
- It is a major source of pollution.

Another major source of air pollution in the form of green house gas is our cooling technology, that
uses the Joule-Thomson effect.

We know these are not good for us, but we don't have an alternative right now.
Can we have a more environment-friendly source of energy? Can we get our house cool with an AC and
keep the milk fresh in our fridge and not pollute the air we breathe in?

We thrive to give a materialistic solution to the problem:
- We work on suitable materials for splitting water to get hydrogen out of it, as hydrogen is a
    very good source of energy.
- We work on magnetocaloric properties of materials, which follows the same Carnot's cycle but
    instead of pressure on the vapour, here we apply magnetic field in suitable materials.

Besides that, We also apply machine learning methods to get benefited from the huge work already done in this
field.

### Methodology

I will generally ask you to work on problems that I have not solved myself and you will not be able
to find a packaged solution on the internet. Also, I may not be able to provide solutions to your
questions. Actually, there may not even be a solution. Accept it, you’re doing research now. Find a
simpler question that will put you on the path to an answer. Doing **research is a continuous
process of adaptation** in _both_ posing the questions _and_ proposing solutions. In other words,
_if you can’t find the answer, change the question_! Start with the simplest questions and simplest
solution proposals and work your way towards the more relevant issues. For further information,
please have a look at Hamming’s lecture on ‘You and Your Research’,
[video](http://www.youtube.com/watch?v=a1zDuOPkMSw "Hamming video, 1995") (1995) or
[html](http://www.cs.virginia.edu/~robins/YouAndYourResearch.html "Hamming html, 1986") (1986), and
think about how this relates to your work.

### Expectations and Deliverables

Your project will likely be embedded as a building block in our research plan. I expect a
**professional attitude** which includes that you conduct yourself as a **team player**. Be aware
that this is _your_ project, so _you_ are responsible for keeping an eye on departmental regulations
and deadlines. Stick to deadlines and promises or inform me ahead of time when plans cannot be
maintained.

1. Understanding own specialization
    - You should (strive to) have a deep understanding of the field/topic that you work on. A good way to get feedback on this goal is to explain to others what you work on.
1. Research skills
    - It’s not enough to be smart and walk around commenting on the world around you. You should also ‘get things done’. Essentially, this issue is about your skills to navigate through your project by posing the right research questions (see the comments above on methodology).
1. Execution
    - This issue is about professionalism. You need to adhere to strict principles of academic honesty and contribute to technical discussions in the team. Your technical opinion is always appreciated but play the ball, not the person.
1. Reporting
    - All your ideas are worth nothing to society if they remain locked up inside your head. As an engineer, you must communicate your ideas well, both to technical and more general audiences.

<!-- Aside from the aforementioned deliverables that are imposed by the Examination Committee, I place a **high value on the quality of your (software) code**. Consider this as a fifth examination criterion. The software that you produce in your project is the sharpest description of your ideas, so make it readable and understandable for others. If you want to read some more on this, consult [Aruliah](http://arxiv.org/abs/1210.0530 "Aruliah et al, Best Practices for Scientific Computing, 2012") (2012) and/or [Cannam](http://soundsoftware.ac.uk/icassp-2012-paper "Cannam et al., Sound Software: Towards Software Reuse in Audio and Music Research, 2012") (2012). Generally, there are many ways to improve your coding skills, e.g., the [lectures by Sandi Metz](https://www.youtube.com/watch?v=8bZh5LMaSmE) are nearly always interesting. -->

<!-- If you do an internship/traineeship (before your final MSc thesis project), the examination criteria are just the same, but of course the expectations on your output are appropriately reduced. -->

If you are from another department, please find out and notify me of which departmental rules and
regulations apply to you.

## Workflow and Tools
First, at MAVENs, we proudly use open-source software.
<img style="float: right; margin: 10px 0px 0px 0px;" src="./foss.webp" width="15%" alt="FOSS">
So, it is better for you to know a priory that your MS Windows is of no use. This might be a big
cultural shock for you, but you need to know that these are a list of few things we use as our
daily driver:

### Linux
Yes, first and foremost, you have to have a linux installation in your laptop.
<img style="float: left; margin: 10px 10px 0px 10px;" src="./linux-tux.webp" width="15%">
This is a free and open source OS. We, the MAVENs generally use the [fedora
distribution](https://fedoraproject.org/), but you can use other distro as well...as long as it is
Linux.

Though, you can do most of your regular work using the mouse, for your research work you have to
get yourself comfortable with terminal and vim editor.

### Spaces
<img style="float: right; margin: 0px 10px 0px 0px;" src="./googlechat.svg" width="15%">

Ideas are usually discussed in a [space](https://mail.google.com/chat/u/1/#chat/home) chatroom.
Space stores a record of the chats, so our discussions are automatically documented for later use,
such as getting newcomers in the team up to speed.

### Git and Github
<img style="float: left; margin: 10px 10px 0px 0px;" src="./git.svg" width="15%">

We use the [git](http://git-scm.com) version control system to track the various developments of
our code base and we organize our projects in repositories at [github](http://github.com). It is
important to become a smooth user of both git and github. We use git and github also to track all
documents that we write ourselves, including your thesis report.

### LaTeX
<img style="float: right; margin: 10px 10px 0px 0px;" src="./LaTeX_logo.svg" width="20%">

The project’s final report and intermittent presentations should be written in
[LaTeX](http://www.latex-project.org/).  You must get familiar with LaTeX early during your
project, because we start writing the final report very soon after the start of the project.

### Zotero

<img style="float: left; margin: 10px 10px 0px 10px;" src="./zotero.webp" width="10%">

After you join the MAVENs, you will also get access to our literature collection that we store
online in a [Zotero](https://www.zotero.org/) repository. This will help you get an overview of all
relevant papers in our field.
<br>
<br>
<br>

## Reporting Tips

Start working on the final report in the first month of the project. In particular, if you follow
[Magnusson’s advice to write
backwards](https://dl.dropboxusercontent.com/u/4512522/Magnusson_1996-How_to_write_backwards.pdf)
(_start with the conclusions_!), then you can **turn report writing into a powerful research tool**
that reveals your next steps to pursue. I _strongly_ encourage you to have a look at [Simon Peyton
Jones](http://research.microsoft.com/en-us/um/people/simonpj/papers/giving-a-talk/giving-a-talk.htm)’
lectures on **writing a paper** ([video](http://sms.cam.ac.uk/media/1464870) and
[slides](http://research.microsoft.com/en-us/um/people/simonpj/papers/giving-a-talk/writing-a-paper-slides.pdf))
and **giving a talk** ([video](http://research.microsoft.com/apps/video/default.aspx?id=168648) and
[slides](http://research.microsoft.com/en-us/um/people/simonpj/papers/giving-a-talk/giving-a-talk-slides.pdf)).

In general, if you work on a MSc thesis project or higher, I’d like you to make a (final) report
update at least once a month. The final report should be in the form of a publishable IEEE journal
paper. So, working on a project implies a monthly refinement of the paper until it’s ready for
submission (or project time runs out). Use the process of incremental report refinement as a tool
to discover what you need to work on next.

## Your First Month

What should you focus on during the first month of your project?

In the first week:

-   Copy and paste in an email addressed to me the following text:

> <—BEGIN EMAIL TEXT—>
>
> I hereby declare that, besides and on top of SRMIST's standard codes of conduct and rules, I will
> - maintain the confidentiality of all methods, data, results, and intellectual property.
> - dedicate
>   - (_For the project students:_) minimum of ten hours per week to the project prior to the final semester, and forty hours per week during the final semester.
>   - (_For the phd students:_) minimum of forty hours per week towards my project.
> - Adhere to the project timelines and milestones
>
> Failure to adhere to this commitment may result in the withdrawal of supervisory support by Dr Banerjee.
>
> – signed, your name and date
>
> <—END EMAIL TEXT—>

- Send me your CV and transcript by email
- Provide me with your email address, tel number, and a photograph (for inclusion on web site, team presentation in slides etc)

Then, start your project:

- You need to get your project goals sharp. Therefore, I suggest that you write your first draft for the project’s final report by the end of the first month, with **focus on the conclusions** (see previously mentioned reporting advice by Magnusson). This first-draft edition of the final paper may find dual use as your project proposal. We are well-aware that the actual project plan may change as the project unrolls due to unforeseen obstacles. Your final evaluation will therefore be based on balancing the realization of project goals versus your creativity in coping with difficult spots.

- Next to the final goals, you need to understand your starting point. Please **get familiar with our existing code base** (at github) that you will be working with. You should be able to understand (y)our code enough to make a change confidently. This also means that you’ll have to start training yourself how to code in Julia and how to work with git (and github). Working with Julia, git and github is a process that you will gradually improve upon, but don’t postpone training yourself on these tools. If you have no experience with version control software, this may feel like a burden in the beginning, but it will become a major asset (for the rest of your career) once you make it a habit to record changes by version control.


Once you got your final goals and starting point clear, you can make an attempt at a project plan. The project plan is basically a list of intermediate goals (called: _milestones_) that you intend to complete on your way from starting point to final goals.


- Finally, I will give you some literature specifically tailored for your project. You should start training yourself in Bayesian modeling and how to do Bayesian inference through message passing in graphical models.


Let me know if this guide helps you and feel free to suggest updates. Good luck and welcome to the team! We look much forward to working with you.
