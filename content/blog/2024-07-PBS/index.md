---
title: PBS job submission in clusters and supercomputers
date: 2024-07-21
Summary: A PBS job submission tutorial.
image:
  focal_point: 'top'
---

## Introduction

When you are using a cluster, irrespective of the scale of it - a local university cluster or EU's
continental service like `prace`, you are looking for your share of a limited resource. This is
why, there are a need to implement a *fairshare* method. This *fairshare* in turn, is used by a
*job scheduler* to start a particular job that is already submitted by the users of the cluster.

*Job scheduler* is nothing exclusive to clusters only. Our day-to-day computers use them as well,
like `at` or `cron` for UNIX or `Windows Task Scheduler` for windows. But, for clusters, there are
many dedicated schedulers, most famous of them are [SLURM](https://slurm.schedmd.com/) and
[PBS](https://www.openpbs.org/).  In this tutorial, I will discuss mostly about PBS. We will
follow-up with a similar tutorial with SLURM soon.

## What is PBS

PBS, and for that any job scheduler, makes user free from searching when a `queue` of a cluster is
available. User specifies his requirements in a `bash script` and PBS finds suitable queue for the
user, and submit the job when required resources are available in that queue. Let us understand PBS
a little bit, before going into submission mode.

### How PBS works

{{< figure src="./img1.webp" id="fig:img1" caption="Job of a job scheduler" numbered="true">}}

PBS does 3 things for us, as shown diagrammatically in [figure 1](#fig:img1).

When jobs are submitted to PBS server, the scheduler finds when and where to run the job. The
server sends the job to Machine Oriented Mini-server (MOM) on the local machine. The server,
scheduler, and communication daemons run on the server host. Their internal relation between them
is shown in [figure 2](#fig:img2).
{{< figure src="./img2.webp" id="fig:img2" caption="How PBS works" numbered="true">}}

As per availability of resources, PBS submits jobs *first come, first serve* basis. But this may
not be same as *first user submission, first serve*. The order that PBS see as *first come* depends
on many factors, like resource availability in near future etc and also, the fairshare.

## Job management in cluster

The first thing first: to submit jobs in a cluster, you have to have access in the cluster. You
generally gain the cluster access by writing a mail to cluster admin. If you fulfill the criteria
as laid by the particular cluster's parent body, you will get your login(say, *foo*) and
password(say, *Foo-pass*). It is strongly recommended to change your password in your very first
login. In a Linux terminal, you do something
like[^1]:

```
$ssh foo@cluster:
$password:
```

Since more often than not, we are interested in batch submission of jobs, we will discuss that user
case here. But don't forger you can submit interactive jobs also.

### Job submission and PBS Script

The first thing you need a proper *executable*, lets say that is `hello.out`. You can check if a
file is executable or not using the following command in terminal:

``` ls -l hello.\*
-rw-rw-r--. 1 rudra rudra 174 Dec 30 09:51 hello.f90
-rwxrwxr-x. 1 rudra rudra 21K Dec 30 09:51 hello.out
```
The presence of `x` in 4th position of `hello.out` shows you can execute the file. For more
details, check [@linperm].

Here, you create a *PBS job submission script*. A typical script looks like:

```
#!/bin/bash
#PBS -q default
#PBS -l nodes=2:ppn=24
#PBS -N trial
#PBS -e trial.err
#PBS -o trial.out
#PBS -l walltime=10:00:00
echo PBS JOB id is $PBS_JOBID
echo PBS_QUEUE is$PBS_QUEUE cat $PBS_NODEFILE
export I_MPI_FABRICS=shm:tmi
cd $PBS_O_WORKDIR
mpirun -np 48 ./hello.out
```
Let us check each line of this script in details[^2]. #PBS in each line tells bash that it is a PBS
command, rather than a bash command like `echo` or `mpirun`.

#### PBS Commands
\#!/bin/bash :   tells the computer that it is a bash script and should always be
    present.

-q :  destination

defines the queue you have chosen. In each cluster, there are multiple queue and each queue has
    some specific max node, processor and wall time. You can find the queue of a particular cluster
    by using `qstat -q`

In my institute's cluster I get:

```
qstat -q
server: hn1-srmhpc03
Queue               Memory CPU Time Walltime Node Run   Que   Lm   State
----------------    ------ -------- -------- ---- ----- ----- ---- -----
short               --      --      240:00:0 14   15    4     --    E R
work-01             --      --      480:00:0 --   34   21 --        E R
res-3               --      --      360:00:0 --    1 1         --   E R
```
-l: resource list

defines the resource list required for the job. Here the uesr has requested 2 nodes and 24
processors in each node for 10 hours (see ` -l walltime` below). How many nodes and processors you
can use depends on the queue you have chosen.

-N: name

Declares a name for the job.

 -e,-o:   path

defines the path (i.e. file) to be used for standard error and output.

echo:

is not a part of PBS, rather it is a normal shell command for printing some value in standard
output. Here, I have chosen to print my job's ID, QUEUE and NODES.

mpirun...:

This is where you are actually telling PBS which job you want to run. Here I have request PBS
    to run my *hello.out* on 48 processors (2 nodes$\times$`<!-- -->`{=html}24 processor per node)
    using mpirun.

#### Environment Variables

The environment variables, that is in capital letter and preceeded with
\$ has the following meannings (taken directly from the man page, for
ready reference)

 - **PBS\_O\_HOST**: The name of the host upon which the qsub command is running.
 - **PBS\_O\_QUEUE**: The name of the original queue to which the job was submitted.
 - **PBS\_O\_WORKDIR**: The absolute path of the current working directory of the qsub
    command.
 - **PBS\_ENVIRONMENT**: Set to PBS_BATCH to indicate the job is a batch job, or to
    PBS_INTERACTIVE to indicate the job is a PBS interactive job, see `-I`  option.
 - **PBS_JOBID**:The job identifier assigned to the job by the batch system.
 - **PBS\_JOBNAME**: The job name supplied by the user.
 - **PBS\_NODEFILE**: The name of the file contain the list of nodes assigned to the job
    (for parallel and cluster systems).
 - **PBS\_QUEUE**: The name of the queue from which the job is executed.

### Job Monitoring

The `qstat` command is used to display the status of jobs, queues, and
batch servers. The status information is written to standard output[^3].

`qstat` without any argument shows all the jobs running in the given
cluster.

```
$qstat
        Job id            Name             User              Time Use S Queue
        ----------------  ---------------- ----------------  -------- - -----
        87733.hn1-srmhpc0 Step-na          hpcuser1          1073:54: R work-01
        87796.hn1-srmhpc0 mmpmg            hpcuser5          00:00:00 R work-01
        87835.hn1-srmhpc0 layers           hpcuser2          7337:16: R work-01
        87915.hn1-srmhpc0 mmpmg            hpcuser2          00:00:00 R short
        88397.hn1-srmhpc0 zgnr_isoleuZn22  hpcuser3                 0 Q work-01
        88398.hn1-srmhpc0 trial            hpcuser9                 0 Q short
        88406.hn1-srmhpc0 PBE0-bkB         hpcuser10                0 Q work-01
        88407.hn1-srmhpc0 PBE0-bkB         hpcuser11         00:00:00 R short
        .. .. ..
```

To monitor your own jobs only, run `qstat -u <username>`
```
qstat -u hpcuser
hn1-srmhpc03:                    
                                                                    Req 'd Req'd Elap
Job ID          Username    Queue     Jobname   SessID      NDS TSK Memory Time S Time
--------------- --------    -------- ---------- ------ --- --- ------ ----- - -----
88303.hn1-srmhp hpcuser     work-01   o-f-M5-srn 27033      1 14 -- 240:0 R 48:02
88306.hn1-srmhp hpcuser     short     o-f-M5-tbn 1580       1 14 -- 120:0 R 33:27
88358.hn1-srmhp hpcuser     work-01   Na-E-VX-op 13364      1 14 -- 240:0 R 03:04
```

In both the output, you can see the job's ID, NAME, the queue its
running and for how long it is running.

The penultimate column, with heading `S` shows the status of the job.
 - R means its running,
 - Q means its on queue, waiting for resources.

 Also, as you can see, Anoopa's job, even submitted later, has started running
before other jobs, as described in §[2.1](#sec:how){reference-type="ref"
reference="sec:how"}. The possible status are:

  - B   Array job: at least one subjob has started.
  - E   Job is exiting after having run.
  - F   Job is finished.
  - H   Job is held.
  - M   Job was moved to another server.
  - Q   Job is queued.
  - R   Job is running.
  - S   Job is suspended.
  - T   Job is being moved to new location.
  - U   Cycle-harvesting job is suspended due to keyboard activity.
  - W   Job is waiting for its submitter-assigned start time to be reached.
  - X   Subjob has completed execution or has been deleted.

Another important command is `qstat -T`, which gives estimeted start
time of the job, as:

```
qstat -T hn1-srmhpc03:                                                 
                                                            Req'd Req'd   Start
Job ID          Username Queue    Jobname  SessID  NDS TSK Memory Time  S Time
--------------- -------- -------- -------- ------- --- --- ------ ----- - -----
88027.hn1-srmhp hpcuser  work-01 Li2U7Li3Vp --     1   28  --     240:0 Q Su 08
88430.hn1-srmhp rudra    short   trial      --     4   48  --     10:00 Q --
```
### Job Deleting

For many reasons, you may want to kill a job after it is submitted. May
be its taking too long time to start or you want to try a different
queue, or simply you found some error in your code after it has started
running. The `qdel <job id>` kills the `<job id\>`.
You can only kill your jobs, not others. The sysadmin can kill anybody's job.

If you try to delete others job, you will get error (eg. I am not
other-user):

```
$qstat 88419
 Job id            Name             User              Time Use S Queue
 ----------------  ---------------- ----------------  -------- - -----
 88419.hn1-srmhpc0 pmnb             other-user               0 Q work-01
$qdel 88419
 qdel: Unauthorized Request 88419
```

For your own job, it will be done without any prompt. For a big job,
`qstat` may show `E` status for some time.

# Sources

[^1]: If you are very new to Linux, I strongly recommend you to go
    through `man ssh`

[^2]: Again, for more details, check `man pbs` and `man qsub`

[^3]: I can't overemphasize the importance of `man` command. As always,
    check `man qstat`
