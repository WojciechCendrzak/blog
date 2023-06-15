---
title: 'AI and Deep Learning - Part 1. History and Future'
date: '2022-12-09'
author: 'Wojciech Cendrzak'
image: '/images/tagged-template-literal-jest-test.png'
tags: 'AI'
isPublished: false
---

## Introduction

### Would you sumarize AI history in funy way
_Here is a brief and humorous summary of the history of AI:_
- _1950s: Scientists start dreaming about creating machines that are smarter than humans, which is a really smart idea because machines don't have feelings and can work 24/7._
- _1960s: The first AI program is created, and it's so smart that it's able to convince everyone that it's human by using clever patterns and big words._
- _1970s: AI research hits a bump in the road, as some people start to realize that machines might take over the world and turn us all into batteries._
- _1980s: AI takes a back seat to arcade games and big hair, but some clever researchers continue to work on making machines smarter in secret._
- _1990s: The internet becomes a thing, and suddenly everyone realizes that they can talk to machines and make them do stuff._
- _2000s: Chatbots become popular, and people start to realize that they're not as smart as they thought because they always ask you to repeat yourself._
- _2010s: Deep learning comes along and makes everyone realize that machines can actually be pretty smart, and they start to worry about being replaced by robots again._
- _2020s: AI continues to advance, and people are starting to realize that maybe they should just enjoy the ride and stop worrying so much. After all, it's not like the machines are going to take over the world or anything... right?_

### Why last decades brought a breakthrough in AI

_There have been several factors that have contributed to the recent progress in AI. Some of these factors include:_

_The availability of large amounts of data, which has allowed AI systems to be trained on more diverse and realistic datasets._

_Advances in computing power, which have made it possible to train large, complex machine learning models._

_The development of new algorithms and techniques for training and optimizing machine learning models, such as deep learning and reinforcement learning._

_An increased focus on AI research and development, both in academia and industry._

_The growth of cloud computing, which has made it easier for organizations to access the computing resources they need to develop and deploy AI systems._

_The proliferation of smart devices and the Internet of Things (IoT), which has created new opportunities for AI to be used in everyday life._

_The growing recognition of the potential value of AI, both in terms of its economic impact and its ability to solve complex problems._

_Overall, these factors have combined to create a perfect storm of conditions that have enabled significant progress in AI in recent years._

### How deep learning revolitionized AI

_Deep learning is a type of machine learning that involves using artificial neural networks to learn and make predictions. These neural networks are inspired by the structure and function of the human brain, and they are able to learn and adapt to new data without being explicitly programmed._

_Deep learning has revolutionized the field of artificial intelligence (AI) by enabling machines to perform complex tasks such as image and speech recognition, natural language processing, and decision making. Before the advent of deep learning, most AI systems were based on hand-crafted rules and required a lot of human effort to develop and maintain. Deep learning, on the other hand, allows machines to learn from data and make predictions on their own, reducing the need for human intervention and enabling AI systems to become more accurate and efficient over time._

_Some examples of the ways in which deep learning has been applied include self-driving cars, which use deep learning algorithms to interpret sensor data and make decisions about how to navigate the road; medical image analysis, which uses deep learning to identify abnormalities in medical images; and language translation, which uses deep learning to translate text from one language to another._

_Overall, deep learning has helped to advance the field of AI by allowing machines to learn and make predictions in a more human-like way, and it has opened up many new possibilities for the application of AI in a wide range of industries._

## Theory

### Please compare sigmoid with relu

Sigmoid and ReLU (rectified linear unit) are two commonly used activation functions in artificial neural networks. An activation function is a mathematical function that is applied to the output of a neuron in order to determine whether it should be activated or not.

Sigmoid is a type of activation function that takes in a real-valued input and produces a binary output. It is defined as:

```py
sigmoid(x) = 1 / (1 + exp(-x))
```

where x is the input and exp is the exponent function. The output of the sigmoid function is always between 0 and 1, and it is often used as a probability. For example, if the output of the sigmoid function is 0.8, it can be interpreted as a probability of 0.8 that the neuron should be activated.

ReLU is another commonly used activation function. It is defined as:

```py
ReLU(x) = max(0, x)
```

where x is the input and max is the maximum function. The output of the ReLU function is always non-negative, and it is equal to 0 for all negative inputs. This makes it an efficient choice for many machine learning algorithms, as it can reduce the computational cost compared to other activation functions.

Overall, sigmoid and ReLU are two commonly used activation functions in artificial neural networks. Sigmoid produces a binary output, while ReLU produces a non-negative output. Both have their own advantages and disadvantages, and which one to use depends on the specific problem and the neural network architecture.

### What is vanishing gradient problem

### What is activation function

An activation function is a mathematical function that is applied to the output of a neuron in an artificial neural network. The purpose of the activation function is to determine whether the neuron should be activated or not, based on its input.

The output of a neuron is a linear combination of its inputs, and the activation function is applied to this output in order to produce the final output of the neuron. The activation function is typically a non-linear function, which means that it can introduce non-linearity into the neural network and enable it to learn complex patterns in the data.

There are many different types of activation functions that can be used in artificial neural networks. Some commonly used activation functions include sigmoid, ReLU (rectified linear unit), and tanh (hyperbolic tangent). Each activation function has its own characteristics and properties, and which one to use depends on the specific problem and the neural network architecture.

Overall, an activation function is a mathematical function that is applied to the output of a neuron in an artificial neural network. It determines whether the neuron should be activated or not, based on its input, and it introduces non-linearity into the neural network. There are many different types of activation functions that can be used, and which one to use depends on the specific problem and the neural network architecture.

## Summary


END




### Please put milestone in timeline
Here is a timeline of some key milestones in the history of AI:

1950s: The field of AI is founded, with researchers exploring the idea of creating machines that can simulate human intelligence.
1956: The first AI conference is held at Dartmouth College, where researchers discuss the potential of creating machines with human-like intelligence.
1959: The first AI program, called the General Problem Solver, is developed by Herbert Simon and Allen Newell.
1966: The first expert system, called Dendral, is developed at Stanford University. It is capable of identifying organic molecules.
1969: The first neural network program, called the Perceptron, is developed by Marvin Minsky and Seymour Papert.
1979: The first commercially available expert system, called MYCIN, is released. It is used for diagnosing blood infections.
1980s: AI research expands to include other areas, such as natural language processing and machine learning.
1989: The first self-driving car, called the NavLab, is developed by researchers at Carnegie Mellon University.
1997: The first successful defeat of a human at the game of Go by a computer program, called Deep Blue, is achieved by IBM.
2006: The first deep learning program, called Deep Belief Networks, is developed by Geoffrey Hinton and his team at the University of Toronto.
2010s: AI becomes more widely adopted in a range of industries, including healthcare, finance, and transportation.
2016: AlphaGo, a program developed by Google DeepMind, defeats the world champion at the game of Go.
2020s: AI continues to advance, with developments in areas such as natural language generation and reinforcement learning.
This timeline is just a brief overview of some of the key milestones in the history of AI, and many other important developments have occurred over the years.




Wojciech Cendrzak
Put milestones of chatbot in timeline
Here is a timeline of some key milestones in the history of chatbots:

1950s: The first chatbot, called ELIZA, is developed by Joseph Weizenbaum at MIT. It is able to simulate conversation by using pattern matching and natural language processing.
1960s: ELIZA becomes a popular research tool and is used in a variety of applications, including customer service and psychotherapy.
1980s: New chatbot programs are developed, such as PARRY, which is designed to simulate a person with paranoid schizophrenia.
1990s: Chatbots become more sophisticated, with the development of programs that use machine learning and natural language understanding to improve their performance.
2000s: Chatbots become more widely used, with the rise of messaging apps and virtual assistants.
2010s: Advances in deep learning and natural language processing enable chatbots to become more intelligent and conversational.
2020s: Chatbots continue to evolve, with the development of new technologies such as natural language generation and reinforcement learning.
This timeline is just a brief overview of some of the key milestones in the history of chatbots, and many other important developments have occurred over the years.




Wojciech Cendrzak
Would you sumarize AI history in funy way
Here is a brief and humorous summary of the history of AI:

1950s: Scientists start dreaming about creating machines that are smarter than humans, which is a really smart idea because machines don't have feelings and can work 24/7.
1960s: The first AI program is created, and it's so smart that it's able to convince everyone that it's human by using clever patterns and big words.
1970s: AI research hits a bump in the road, as some people start to realize that machines might take over the world and turn us all into batteries.
1980s: AI takes a back seat to arcade games and big hair, but some clever researchers continue to work on making machines smarter in secret.
1990s: The internet becomes a thing, and suddenly everyone realizes that they can talk to machines and make them do stuff.
2000s: Chatbots become popular, and people start to realize that they're not as smart as they thought because they always ask you to repeat yourself.
2010s: Deep learning comes along and makes everyone realize that machines can actually be pretty smart, and they start to worry about being replaced by robots again.
2020s: AI continues to advance, and people are starting to realize that maybe they should just enjoy the ride and stop worrying so much. After all, it's not like the machines are going to take over the world or anything... right?
